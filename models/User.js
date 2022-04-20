const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  pwd: { type: String, required: true },
  age: { type: Number, required: true },
  profession: { type: String, required: true },
  interests: {
    type: String,
    default: "Este usuário não possui interesses.",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", Schema);

module.exports = User;
