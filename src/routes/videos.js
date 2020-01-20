// videos.js
const express = require('express');
const router = express.Router();

const Video = require("../models/videoModel");
const Thumbnail = require("../helpers/thumbnail");
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
router.post('/videos', async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
	    return res.status(400).send('No files were uploaded.');
	}
	//console.log(req.files.video);

	// The name of the input field
	let classVideo = req.files.video;

	// Place the file into the route of the server
	let urlMV = {
		serverPath: '/factor/'+process.env.DIR_STATICS, 
		internPath: '/classes/'+req.body.course+'/', 
		videoName: 'class-'+Date.now()+'-'+req.files.video.name
	};

	classVideo.mv(urlMV.serverPath+urlMV.internPath+urlMV.videoName, function(err) {
	    if (err)
	      return res.status(500).send(err);
	    //res.send('File uploaded!');
	});

	// Save video information into the DB
	Video.find({'course': req.body.course}, (err, videos) => {
		if (err) {res.status(500).json(err); return;}

		//create Thumbnail
		Thumbnail.extract(
			urlMV.serverPath+urlMV.internPath+urlMV.videoName, 
			urlMV.serverPath+'/pictures/'+req.body.course+'/'+urlMV.videoName.split('.')[0]+'.png', 
			'00:00:22', '300x225', function(err,stdout){
				if(err) {console.log(err);res.status(500).json(err); return;}
				console.log('snapshot saved');
				console.log(stdout);
		});

		// Retreave data
		let classVideoNum = videos.length;
		let video = new Video({
		    name: req.files.video.name,
		    url: urlMV.internPath,
		    duration: 0, //time video
		    class: classVideoNum,
		    thumbnail: process.env.DIR_STATICS+'/pictures/'+req.body.course+'/'+urlMV.videoName.split('.')[0]+'.png',
		    course: req.body.course
		});
	  	video.save((error,obj) => {
			if (error) {res.status(500).json(error); return;}

			// Save video duration
			Thumbnail.duration(urlMV.serverPath+urlMV.internPath+urlMV.videoName, obj._id);

			res.status(200).json({message: 'video saved', token: video});
			return;
	  	});
	});
});
module.exports = router;