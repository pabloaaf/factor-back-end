// Transcript.Model.js
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

// schema
const itemSchema = new mongoose.Schema({
    start_time: { type: String}, //course name.
    end_time: { type: String}, //Number of identification human-redable.
    alternatives: { [confidence: { type: String},content: { type: String}]},
    type: { type: String}
},{collection: 'itemC'});
mongoose.model("item", itemSchema, "itemC");

// schema
const resultSchema = new mongoose.Schema({
    transcripts: { transcript: { type: String}}, //course name.
    items: { [type: mongoose.Schema.Type.ObjectId, ref: 'item']} //Number of identification human-redable.
},{collection: 'resultC'});
mongoose.model("result", resultSchema, "resultC");

// schema
const transcriptSchema = new mongoose.Schema({
    jobName: { type: String}, //course name.
    accountID: { type: Number}, //Number of identification human-redable.
    results: { type: mongoose.Schema.Type.ObjectId, ref: 'result'} //The professor of the course.
},{collection: 'TranscriptC'});

/*transcriptSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    number: this.number,
    professor: this.professor,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.SECRET_JWT);
};*/

const Transcript = mongoose.model("Transcript", transcriptSchema, "TranscriptC");
module.exports = Transcript;


// extract references to submodels
//Post.findOne({_id: 123}).populate('postedBy').exec(function(err, post) {
    // do stuff with post
//});