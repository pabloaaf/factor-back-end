// courses.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID
const Course = require("../models/courseModel");
const User = require("../models/userModel");


/* GET all courses. */ //Delete in next reviews sino parsear array a min JWT
router.get('/courses', (req, res) => {
	Course.find({}, (err, courses) => {
		if (err) {res.status(500).send(err); return;}

		res.status(200).json(courses);
		return;
	});
});

/* GET info of an array of course ID. */
router.post('/courses/id', (req, res) => {
	let IDs = [];
	let numIDs = 0;
	if(req.body.id) {
		numIDs = req.body.id.length;
	}
	for (var i = 0; i <= numIDs - 1; i++) {
		IDs[i] = new ObjectID(req.body.id[i]);
	}
	Course.find({'_id': { $in: IDs}}, (err, course) => {
		if (err) {res.status(500).json(err); return;}

		res.status(200).json(course);
		return;
	});
});

/* POST course. */
router.post('/courses', (req, res) => {
	let course = new Course({
	    name: req.body.name,
	    number: req.body.number,
	    professorID: req.body.professor
	});
  	course.save(error => {
		if (error) {res.status(500).json(error); return;}
  	});

  	// Launch tool to create a folder of the course
  	// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
	//fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
  		//if (err) throw err;
	//});
	createFolder(process.env.DIR_STATICS+'/classes/'+course._id);
	createFolder(process.env.DIR_STATICS+'/pictures/'+course._id);
	createFolder(process.env.DIR_STATICS+'/audios/'+course._id);

  	res.status(200).json({message: 'course saved', token: course});
	return;
});

// Takes folder path and adds the base directory before creating the folder
function createFolder(folderPath){
	const root = "/factor/";
    let path = root + folderPath + "/";
    console.log(path);
    fs.mkdir(path, { recursive: true }, function(event, err){
        if (err) {res.status(500).json(err); return;}
        if (event === null) {
            console.log("Created a folder at " + path);
        }
    });

}

module.exports = router;