// videos.js
const express = require('express');
const router = express.Router();

const Video = require("../models/videoModel");

/* GET all videos. */ //Delete in next reviews sino parsear array a min JWT
router.get('/videos', (req, res) => {
	Video.find({}, (err, videos) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json(videos);
		return;
	});
});

/* GET one video. */
router.get('/videos/:id', (req, res) => {
	Video.findById(req.params.id, (err, video) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json({token:video.generateJwt()});
		return;
	});
});

/* GET videos of the same course ordered by class number. */

/* POST video. */

module.exports = router;