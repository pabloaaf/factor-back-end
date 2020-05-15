const express = require('express');
const router = express.Router();

const { videoController: controller } = require('../controllers');

/**
 * Route: /api/videos
 */

router
	.route('/')
	// .get(controller.getMany)
	.post(controller.createResource);

router
	.route('/:id')
	.get(controller.getOne)
	.put(controller.updateResource)
	.delete(controller.deleteResource);

router
	.route('/:id/transcriptions')
	.get(controller.getOneTranscription);

module.exports = router;

/*
const ObjectID = require('mongodb').ObjectID;
const TC = require("../models/transcriptModel.db");
const Video = require("../models/videoModel.db");
const Thumbnail = require("../helpers/thumbnail");
const AWSTranscribe = require("../helpers/aws-transcribe");
//const fs = require("fs");

/* GET all videos. * / //Delete in next reviews sino parsear array a min JWT
router.get('/videos', (req, res) => {
	Video.find({}, (err, videos) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json(videos);
		return;
	});
});

/* GET one video. * /
/*router.get('/videos/:id', (req, res) => {
	Video.findById(req.params.id, (err, video) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json({token:video.generateJwt()});
		return;
	});
});*/

/* GET videos of the same course ordered by class number. * /
router.post('/videos/course', (req, res) => {
	//console.log(req.body.courses);
	Video.find({'courseID': { $in: req.body.courses}}).select("name duration thumbnail class courseID").exec(function(err, videos) {
		if (err) {res.status(500).send(err); return;}
		if(videos){
			res.status(200).json(videos);
			return;
		}
		return;
	});
});

/* GET one video information. * / // DELETE
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

/* PUT video information. * /
router.put('/videos/id', async (req, res) => {
	let video = await Video.findById(new ObjectID(req.body.id));
	if(video){
		let course = await Course.findById(new ObjectID(req.body.course));
		if(course) {
			video.courseID = req.body.course;
		}
		if(video.name != req.body.name) {
			video.name = req.body.name;
		}
		video.save();

		res.status(200).json(video);
		return;
	}
	return;
});

/* POST video. * /
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
		serverPath: '/'+process.cwd()+'/'+process.env.DIR_STATICS, 
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
	Video.find({'courseID': req.body.course}, async (err, videos) => {
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
		  	video.save(async (error,obj) => {
				if (error) {res.status(500).json(error); return;}				
				res.status(200).json({message: 'video saved', token: video});
				Promise.resolve('/'+process.env.DIR_STATICS+urlCTA.internAPath+urlCTA.finalName)
				.then(async filePath => {
					// Save video duration
					console.log("Extract duration");
					console.log(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4');
					console.log(obj._id);
					return await Thumbnail.duration(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', obj._id);
				}).then(async filePath => {
					// Save audio best quality ==> wav from video
					console.log("Extract audio");
					console.log(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4');
					console.log(urlCTA.serverPath+urlCTA.internAPath+urlCTA.finalName+'.wav');
					console.log(obj._id);
					return await Thumbnail.extractAudio(urlCTA.serverPath+urlCTA.internCPath+urlCTA.finalName+'.mp4', urlCTA.serverPath+urlCTA.internAPath+urlCTA.finalName+'.wav', obj._id);
				}).then(async filePath => {
					console.log("Send audio to S3 bucket");
					console.log(filePath);
					return await AWSTranscribe.storeAudioToBucket(urlCTA.serverPath+urlCTA.internAPath+urlCTA.finalName+'.wav');
				}).then(async name => {
					console.log("Transcribe job");
					console.log(name);
					return await AWSTranscribe.transcribeAudio(name);
				}).then(async transcription_result => {
					console.log("Retrieve audio");
					console.log(transcription_result);
					let response;
					do {
						await new Promise(r => setTimeout(r, 10000));
						response = await AWSTranscribe.lookupTranscribeCompletion(transcription_result);
						console.log("Still waiting");
						console.log(response.TranscriptionJob.TranscriptionJobStatus);
					}
					while (response.TranscriptionJob.TranscriptionJobStatus == "IN_PROGRESS");
					return response.TranscriptionJob.Transcript.TranscriptFileUri;
				}).then(async transcripts => {
					console.log("Store Transcripts");
					console.log(transcripts);
					let ruta = transcripts.split("/");
					let nombre = ruta[ruta.length - 1]
					let data = await AWSTranscribe.retrieveTranscribedAudio(nombre);
					console.log(data);
					let json = JSON.parse(data.Body);
					await AWSTranscribe.saveTranscripts(json, obj._id);
					console.log("finalizado");
				}).catch(err => console.log(err));
		  	});
		  	return;
		}
		return;
	});
});

/* Post video transcription. * /
router.post('/videos/transcriptions', async (req, res) => {
	//console.log(req.body);
	let input = JSON.parse(req.body.transcription);

	//console.log(input.results);
	// call save transcripts
	saveTranscripts(input, req.body._id);
	res.status(200).json(transcript);
	return;
});

// read video transcription
router.post('/videos/transcriptions/id', async (req, res) => {
	let transcript = await TC.Transcript.findOne({videoID: req.body.id}).populate({path:'result', populate: [{path:'item'}]});
	if(transcript){
		res.status(200).json(transcript);
		return;
	} /*else if(!transcript) {
		res.status(200).json({});
	}* /
	res.status(500).json({message:'IN_PROGRESS'}); return;
});

/*router.post('/videos/test', (req, res) => {
	console.log(process.cwd());
	const fileContent = fs.readFileSync(req.body.path+"");
	res.status(200).json(fileContent);
	return;
});*/
