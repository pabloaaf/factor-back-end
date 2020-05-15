// User.model.js
const mongoose = require("mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;   

// schema
const userSchema = new mongoose.Schema({
    gId: { type: Number, unique: true, required: true }, // Google ID (prefered for the number type)
    email: { type: String, unique: true, required: true }, //The user's email address.
    family_name: { type: String}, //The user's last name.
    given_name: { type: String}, //The user's first name.
    locale: { type: String}, //The user's preferred locale.
    picture: { type: String}, //URL of the user's picture image.
    verified_email: { type: Boolean}, //Boolean flag which is true if the email address is verified. Always verified because we only return the user's primary email address.
    coursesID: { type: [String]},
    authlvl: { type: Number, min: 1, max: 128},
    hash: { type: String},
    salt: { type: String}
},{collection: 'UserColl'});

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
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.SECRET_JWT);
};

userSchema.methods.generateMinJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        //email: this.email,
        //family_name: this.family_name,
        //given_name: this.given_name,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.SECRET_JWT);
};

/* Delete properties which will not be sent to the client */
userSchema.methods.minimize = function() {
    var obj = this.toObject();
    delete obj.hash;
    delete obj.salt;
    return obj;
}
const User = mongoose.model("User", userSchema, "UserColl");
module.exports = User;