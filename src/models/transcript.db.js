const mongoose = require("mongoose");

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
},{collection: 'TranscriptCol'}); //create incomplete field before job finish

const Transcript = mongoose.model("Transcript", transcriptSchema, "TranscriptCol");
module.exports = {
    Transcript: Transcript,
    Result: Result,
    Item: Item
};