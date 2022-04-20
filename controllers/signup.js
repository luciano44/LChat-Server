const User = require("../models/User");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

const signUp = (req, res) => {
  const { name, pwd, age, profession, interests } = req.body;
  console.log(req.body);

  if (!name || !pwd || !age || !profession || !interests) {
    return res.status(401).send({ msg: "Preencha todos os campos" });
  }

  const hashedPwd = bcrypt.hashSync(pwd, 10);

  //check if username already exists
  User.findOne({ name: name }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ msg: "Erro" });
    }

    if (user) return res.status(401).send({ msg: "Nome de usuário ja existe" });

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
        if (err) return res.status(401).send({ msg: "Usuário não cadastrado" });
      }
    );

    res.status(201).send({ msg: "Usuário cadastrado com sucesso" });
  });
};

module.exports = signUp;
