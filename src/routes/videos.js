// videos.js
const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;   

const Video = require("../models/videoModel");
const TC = require("../models/transcriptModel");
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
/*router.get('/videos/:id', (req, res) => {
	Video.findById(req.params.id, (err, video) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json({token:video.generateJwt()});
		return;
	});
});*/

/* GET videos of the same course ordered by class number. */
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

/* GET one video information. */
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

/* PUT video information. */
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

/* Post video transcription. */
router.post('/videos/transcriptions', async (req, res) => {
	/*Video.findById(new ObjectID(req.body.id), (err, video) => {
		if (err) {res.status(500).send(err); return;}
		if(video){
			res.status(200).json(video);
			return;
		}
		return;
	});*/
	//console.log(req.body);
	let input = JSON.parse(req.body.transcription);

	//console.log(input.results);
	console.log(input.results.items[0].alternatives);
	

	let itemCollection = [];
	for (let i = 0; i < input.results.items.length; i++) {
		let typeI = input.results.items[i].type;
		let alternativesI = [];
		for (let j = 0; j < input.results.items[i].alternatives.length; j++) {
			console.log(input.results.items[i].alternatives[j].confidence);
			await alternativesI.push({
				confidence: input.results.items[i].alternatives[j].confidence,
				content: input.results.items[i].alternatives[j].content
			});
		}
		let itemI;
		if(typeI == "punctuation"){
			itemI = await new TC.Item({
				alternatives: input.results.items[i].alternatives,
				type: typeI,
			});
		} else {
			itemI = await new TC.Item({
				start_time: input.results.items[i].start_time,
				end_time: input.results.items[i].end_time,
				alternatives: input.results.items[i].alternatives,
				type: typeI,
			});
		}
		let itemF = await itemI.save();
		await itemCollection.push(itemF._id);
	}

	let resultI = await new TC.Result({
		transcripts: input.results.transcripts[0].transcript,
		item: itemCollection
	});
	let resultF = await resultI.save();
	console.log(resultF);
	let tcript = await new TC.Transcript({
		jobName: input.jobName,
		accountID: input.accountId,
		result: resultF._id,
		videoID: req.body.videoID
	});

	console.log(tcript);

	let transcript = await tcript.save();
	res.status(200).json(transcript);
	return;
});
router.post('/videos/transcriptions/id', async (req, res) => {
	let transcript = await TC.Transcript.findOne({videoID: req.body.id}).populate({path:'result', populate: [{path:'item'}]});
	if(transcript){
		res.status(200).json(transcript);
		return;
	}
	res.status(500).json(); return;
});

module.exports = router;

/*router.post('/videos/transcriptions/id', async (req, res) => {
	let transcript = await TC.Transcript.findOne({videoID: req.body.id}).populate({path:'result'});
	if(transcript){
		var options = {
	      path: 'result.item',
	      model: 'item'
	    };

	    Project.populate(docs, options, function (err, projects) {
	      res.json(projects);
	    });
		res.status(200).json(transcript);
		return;
	}
	res.status(500).json(); return;
});

module.exports = router;*/