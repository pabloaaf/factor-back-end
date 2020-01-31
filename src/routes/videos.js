// videos.js
const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;   

const Video = require("../models/videoModel");
const Thumbnail = require("../helpers/thumbnail");

/* GET all videos. */ //Delete in next reviews sino parsear array a min JWT
router.get('/videos', (req, res) => {
	Video.find({}, (err, videos) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json(videos);
		return;
	});
});

/* GET one video. */
router.get('/videos/:id', (req, res) => {
	Video.findById(req.params.id, (err, video) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json({token:video.generateJwt()});
		return;
	});
});

/* GET videos of the same course ordered by class number. */
router.post('/videos/course', (req, res) => {
	Video.find({'courseID': { $in: req.body.course}}).select("name duration thumbnail class courseID").exec(function(err, videos) {
		if (err) {res.status(500).send(err); return;}
		if(videos){
			res.status(200).json(videos);
			return;
		}
		return;
	});
});

/* GET video information. */
router.post('/videos/id', (req, res) => {
	Video.findById(new ObjectID(req.body.id), (err, video) => {
		if (err) {res.status(500).send(err); return;}
		if(video){
			res.status(200).json(video);
			return;
		}
		return;
	});
});

/* POST video. */
router.post('/videos', async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
	    return res.status(400).send('No files were uploaded.');
	}
	//console.log(req.files.video);

	// The input field
	let classVideo = req.files.video;

	// Verify file .mp4
	if(classVideo.name.split('.').slice(-1)[0].toLowerCase() != 'mp4'){
		return res.status(500).send('file type not mp4');
	}

	// Place the file into the route of the server
	let urlCTA = {
		serverPath: '/'+process.env.DOCKER_FOLDER+'/'+process.env.DIR_STATICS, 
		internCPath: '/classes/'+req.body.course+'/', 
		internTPath: '/pictures/'+req.body.course+'/', 
		internAPath: '/audios/'+req.body.course+'/', 
		finalName: 'class-'+Date.now()+'-'+classVideo.name.split('.')[0]
	};

	classVideo.mv(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', function(err) {
	    if (err) return res.status(500).send(err);
	    //res.send('File uploaded!');
	});

	// Save video information into the DB
	Video.find({'courseID': req.body.course}, (err, videos) => {
		if (err) {res.status(500).json(err); return;}
		if(videos){
			// Create Thumbnail
			Thumbnail.extract(
				urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', 
				urlCTA.serverPath+urlCTA.internTPath+urlCTA.finalName+'.png', 
				'00:00:22', '300x225', function(err,stdout){
					if(err) {console.log(err);return;}//res.status(500).json(err); return;}
					console.log('snapshot saved');
					console.log(stdout);
			});

			// Retreave data
			let classVideoNum = videos.length;
			let video = new Video({
			    name: req.files.video.name,
			    url: process.env.DIR_STATICS+urlCTA.internCPath+urlCTA.finalName+'.mp4',
			    duration: 0, //time video
			    class: classVideoNum,
			    thumbnail: process.env.DIR_STATICS+urlCTA.internTPath+urlCTA.finalName+'.png',
			    courseID: req.body.course
			});
		  	video.save((error,obj) => {
				if (error) {res.status(500).json(error); return;}

				// Save video duration
				Thumbnail.duration(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', obj._id);

				// Save audio best quality ==> wav from video
				Thumbnail.extractAudio(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', urlCTA.serverPath+urlCTA.internAPath+urlCTA.finalName+'.wav', obj._id);

				res.status(200).json({message: 'video saved', token: video});
				return;
		  	});
		  	return;
		}
		return;
	});
});
module.exports = router;