const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const signIn = async (req, res) => {
  const { name, pwd } = req.body;

  const response = (status, msg) => {
    return res.status(status).send({ msg });
  };

  if (!name || !pwd) {
    return response(401, "Preencha todos os campos");
  }

  const userDB = await User.findOne({ name: name });
  const hashedPwd = userDB.pwd;

  const match = await bcrypt.compare(pwd, hashedPwd);

  if (!match) {
    return response(401, "Senha incorreta");
  }

  const token = jwt.sign({ name: userDB.name }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  res.status(200).send({ msg: "Login feito com sucesso", token });
};

module.exports = signIn;
