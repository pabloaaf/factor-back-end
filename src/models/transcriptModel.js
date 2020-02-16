// Transcript.Model.js
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;   

// schema
const itemSchema = new mongoose.Schema({
    start_time: { type: String}, 
    end_time: { type: String}, 
    alternatives: [{ confidence: { type: String},content: { type: String}}],
    type: { type: String}
},{collection: 'itemCol'});
const Item = mongoose.model("item", itemSchema, "itemCol");

// schema
const resultSchema = new mongoose.Schema({
    transcripts: { type: String},
    item: [{type: mongoose.Schema.Types.ObjectId, ref: 'item'}] 
},{collection: 'resultCol'});
const Result = mongoose.model("result", resultSchema, "resultCol");

// schema
const transcriptSchema = new mongoose.Schema({
    jobName: { type: String}, 
    accountID: { type: Number}, 
    result: { type: mongoose.Schema.Types.ObjectId, ref: 'result'}, 
    videoID: { type: String}
},{collection: 'TranscriptCol'});

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

const Transcript = mongoose.model("Transcript", transcriptSchema, "TranscriptCol");
module.exports = {
    Transcript: Transcript,
    Result: Result,
    Item: Item
};


// extract references to submodels
//Post.findOne({_id: 123}).populate('postedBy').exec(function(err, post) {
    // do stuff with post
//});