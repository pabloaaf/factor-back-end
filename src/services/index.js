const courseService = require('./course.service');
const authService = require('./oauth.service');
const userService = require('./user.service');
const videoService = require('./video.service');
const transcriptService = require('./transcript.service');

module.exports = {
  courseService,
  authService,
  userService,
  videoService,
  transcriptService
};
