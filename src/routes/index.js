const express = require('express');

const router = express.Router();

const courses = require('./courses.routes');
const oauth = require('./oauth.routes');
const users = require('./users.routes');
const videos = require('./videos.routes');

const fileUpload = require('express-fileupload');

// Routes
// ToDo add swagger
router.use('/auth', oauth);
router.use('/users', users);
router.use('/courses', courses);

// Video upload middleware
router.use('/videos', fileUpload());
router.use('/videos', videos);

// Serve folder static resources
router.use('/assets', express.static('/'+process.env.DIR_STATICS+'/'));

module.exports = router;

// const { authMiddleware } = require('../middleware');

//router.use('/auth', auth);

// Use auth middleware
// router.use(authMiddleware);
