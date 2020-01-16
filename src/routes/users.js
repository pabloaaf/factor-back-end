// users.js
const express = require('express');
const router = express.Router();

const User = require("../models/userModel");

/* GET all users. */ //Delete in next reviews sino parsear array a min JWT
router.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json(users);
		return;
	});
});

/* GET one user. */
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json({token:user.generateJwt()});
		return;
	});
});

module.exports = router;