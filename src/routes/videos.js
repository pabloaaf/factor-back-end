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
router.post('/videos', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.files.video); // the uploaded file object

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let classVideo = req.files.video;

  // Use the mv() method to place the file somewhere on your server
  classVideo.mv('/assets/classes/class-'+Date.now()+'-'+req.files.foo.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});
module.exports = router;