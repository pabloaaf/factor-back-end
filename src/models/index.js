const Mongoose = require('mongoose');
const CourseModel = require('./course.db');
const TranscriptModel = require('./transcript.db');
const UserModel = require('./user.db');
const VideoModel = require('./video.db');

Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false, replSet: {readPreference: 'ReadPreference.NEAREST'} })
  .then(() => {console.log('[MONGODB]: MongoDB Connected')})
  .catch(error => {console.log('[MONGODB]:', error)});

module.exports = {
  CourseModel,
  TranscriptModel,
  UserModel,
  VideoModel
};
