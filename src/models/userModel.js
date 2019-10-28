// User.model.js
const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema({
  email: {type:String},
  pass: {type:String} //test
});
const User = mongoose.model("User", userSchema);
module.exports = User;