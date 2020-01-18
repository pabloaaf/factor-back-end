// videos.js
const express = require('express');
const router = express.Router();

const Video = require("../models/videoModel");

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
const upload = multer({dest: './'+process.env.DIR+'/'}).single('video');

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
router.post('/videos', function (req, res, next) {
    let path = '';
    upload(req, res, function (err) {
        if (err) {
          // Error when uploading
          console.log(err);
          return res.status(500).send("an Error occured");
        }
        path = req.file.path;
        return res.status(200).json(path); 
  	});   
});

module.exports = router;