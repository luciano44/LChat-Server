const User = require("../models/User");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

const signUp = (req, res) => {
  const { name, pwd, age, profession, interests } = req.body;

  function response(status, msg) {
    return res.status(status).send({ msg });
  }

  if (!name || !pwd || !age || !profession || !interests) {
    return response(401, "Preencha todos os campos");
  }
  if (name.includes(" ")) {
    return response(401, "Nome não pode conter espaços");
  }
  if (pwd.length < 7 || pwd.length > 30) {
    return response(401, "Senha deve conter pelo menos 7 caracteres");
  }

  const hashedPwd = bcrypt.hashSync(pwd, 10);

  //check if username already exists
  User.findOne({ name: name }, (err, user) => {
    if (err) {
      console.log(err);
      return response(401, "Erro");
    }

    if (user) {
      return response(401, "Nome de usuário ja existe");
    }

    User.create(
      {
        id: v4(),
        name,
        pwd: hashedPwd,
        age: Number(age),
        profession,
        interests,
      },
      (err) => {
        if (err) return response(401, "Erro, Usuário não cadastrado");
      }
    );

    response(201, "Usuário cadastrado com sucesso");
  });
};

module.exports = signUp;
