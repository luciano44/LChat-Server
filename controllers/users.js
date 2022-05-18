const User = require("../models/User");

const users = async (req, res) => {
  const { user } = req.params;

  if (!user) {
    const usersDB = await User.find({});
    return res.send({ usersDB });
  }

  const userDB = await User.findOne({ name: user });

  if (userDB) {
    return res.send({ userDB });
  }

  res.status(404).send(`${user} not found`);
};

module.exports = users;
