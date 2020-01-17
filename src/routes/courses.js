// courses.js
const express = require('express');
const router = express.Router();

const Course = require("../models/courseModel");

/* GET all courses. */ //Delete in next reviews sino parsear array a min JWT
router.get('/courses', (req, res) => {
	Course.find({}, (err, courses) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json(courses);
		return;
	});
});

/* GET info of an array of course ID. */
router.post('/courses/id', (req, res) => {
	Course.find({'_id': { $in: [req.body.id]}}, (err, course) => {
		if (err) {res.status(500).json(error); return;}

		res.status(200).json(course);
		return;
	});
});

/* POST course. */
router.post('/courses', (req, res) => {
	let course = new Course({
	    name: req.body.name,
	    number: req.body.number,
	    professor: req.body.professor
	});
  	course.save(error => {
		if (error) {res.status(500).json(error); return;}
  	});
  	res.status(200).json({message: 'course saved', token: course});
	return;
});

module.exports = router;