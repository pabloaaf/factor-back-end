// User.model.js
const mongoose = require("mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  authlvl: {type:Number},
  hash: {type:String},
  salt: {type:String},
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    authlvl: this.authlvl,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.SECRET_JWT); // ------ Change ---------
};

const User = mongoose.model("User", userSchema);
module.exports = User;