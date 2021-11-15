const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String }
});

module.exports = mongoose.model("user", user);
