// User.model.js
const mongoose = require("mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true }, //The user's email address.
  family_name: { type: String}, //The user's last name.
  given_name: { type: String}, //The user's first name.
  locale: { type: String}, //The user's preferred locale.
  picture: { type: String}, //URL of the user's picture image.
  verified_email: { type: Boolean}, //Boolean flag which is true if the email address is verified. Always verified because we only return the user's primary email address.
  courses: { type: [Number]},
  authlvl: { type: Number},
  hash: { type: String},
  salt: { type: String}
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
    family_name: this.family_name,
    given_name: this.given_name,
    picture: this.picture,
    authlvl: this.authlvl,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.SECRET_JWT);
};

const User = mongoose.model("User", userSchema);
module.exports = User;