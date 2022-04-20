require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

// controllers
const signUp = require("./controllers/signup");

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
const usersOnline = [];

// db connection
try {
  mongoose.connect(uri);
  console.log("Connected to DATABASE!");
} catch (error) {
  console.log(error);
}

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/signup", signUp);

// SocketIO
io.on("connection", (socket) => {});

http.listen(PORT, () => {
  console.log("Connected to port " + PORT);
});
