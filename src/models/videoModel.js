// Video.Model.js
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

// schema
const videoSchema = new mongoose.Schema({
  name: { type: String}, //course name.
  url: { type: String}, //statics server url
  duration: { type: Number}, //min or seconds?.
  class: { type: Number}, // Ordering the videos with upload time.
  thumbnail: { type: String}, //statics server url
  course: { type: Number} //The course of the video.
});

videoSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    url: this.url,
    professor: this.professor,
    duration: this.duration,
    thumbnail: this.thumbnail,
    course: this.course,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.SECRET_JWT);
};

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;