// Video.Model.js
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

// schema
const videoSchema = new mongoose.Schema({
    name: { type: String}, //video name.
    url: { type: String}, //statics server url
    duration: { type: String}, //min or seconds?.
    class: { type: Number}, // Ordering the videos with upload time.
    thumbnail: { type: String}, //statics server url
    courseID: { type: String} //The course of the video.
},{collection: 'VideoCo'});

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
const Video = mongoose.model("Video", videoSchema, "VideoCo");
module.exports = Video;