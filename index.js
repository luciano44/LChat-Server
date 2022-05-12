require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

// controllers
const signUp = require("./controllers/signup");
const signIn = require("./controllers/signin");

//configuration
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// variables
const uri = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PWD}@apicluster.a1k2u.mongodb.net/LChatDB?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3001;
let usersOnline = [];

setInterval(() => {
  console.log("USERS ONLINE:");
  console.log(usersOnline);
}, 3000);

// SocketIO
io.on("connection", (socket) => {
  usersOnline.push({ id: socket.id });
  io.emit("update-users", usersOnline);

  socket.on("disconnect", () => {
    usersOnline = usersOnline.filter((user) => {
      if (user.id !== socket.id) return user;
    });
  });

  socket.on("login", ({ id, token }) => {
    if (!token) return;
    console.log(id);

    jwt.verify(token, process.env.JWT_SECRET, (err, tokenRes) => {
      if (err) return console.log(err);

      usersOnline = usersOnline.map((user) => {
        if (user.id === id) {
          return { id: user.id, name: tokenRes.name };
        }
        return user;
      });

      const uniqueUsersOnline = usersOnline.filter(
        (user, index, self) =>
          index ===
          self.findIndex((selfuser) => {
            return selfuser.name === user.name;
          })
      );

      io.emit("update-users", uniqueUsersOnline);
    });
  });

  socket.on("send-msg", (msg) => {
    const author = usersOnline.find((user) => user.id === socket.id);

    io.emit("receive-msg", { author: author.name, message: msg });
  });

  socket.on("logout", (id) => {
    console.log("before logout");
    console.log(usersOnline);

    usersOnline = usersOnline.map((user) => {
      if (user.id === id) {
        return { id: user.id };
      } else {
        return user;
      }
    });

    console.log("after logout");
    console.log(usersOnline);
    io.emit("update-users", usersOnline);
  });
});

// db connection
try {
  mongoose.connect(uri);
  console.log("Connected to DATABASE!");
} catch (error) {
  console.log(error);
}

app.post("/signup", signUp);
app.post("/signin", signIn);

http.listen(PORT, () => {
  console.log("Connected to port " + PORT);
});
