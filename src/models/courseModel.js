// Course.Model.js
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

// schema
const courseSchema = new mongoose.Schema({
    name: { type: String}, //course name.
    number: { type: Number}, //Number of identification human-redable.
    professorID: { type: String} //The professor of the course.
    // future section, capacity of students
},{collection: 'CourseCol'});

courseSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        number: this.number,
        professor: this.professor,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.SECRET_JWT);
};

const Course = mongoose.model("Course", courseSchema, "CourseCol");
module.exports = Course;