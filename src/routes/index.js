const express = require('express');

const router = express.Router();

const courses = require('./courses.routes');
const oauth = require('./oauth.routes');
const users = require('./users.routes');
const videos = require('./videos.routes');

const fileUpload = require('express-fileupload');
const middleware = require('../middleware');

// Routes
// ToDo add swagger
router.use('/auth', oauth);
router.use('/users', middleware.authMiddleware, users);
router.use('/courses', middleware.authMiddleware, courses);

// Video upload middleware
router.use('/videos', middleware.authMiddleware, fileUpload());
router.use('/videos', middleware.authMiddleware, videos);

// Serve folder static resources
router.use('/assets', express.static('/'+process.env.DIR_STATICS+'/'));

module.exports = router;