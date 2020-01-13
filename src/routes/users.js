// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const User = require("../models/userModel");
const Google = require("../google-config");

//Set up default mongoose connection
const mongoUrl = 'mongodb://database/mean-docker';

var connectWithRetry = function() {
  return mongoose.connect(mongoUrl, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('api works');
});

/* GET api listing. */
router.get('/oauth', async (req, res) => {
	res.status(200).json(Google.urlGoogle());
});

/* confirm login. */
router.post('/login', (req, res) => {
	console.log(req.body.email);
	User.findOne({ email: req.body.email }, function (err, user) {
		//console.log(user);
      	//if (err) { return done(err); }
	    // Return if user not found in database
	    //res.status(200).json({authlvl: 0});
	    if (!user) {
	    	res.status(200).json({authlvl: 0, err: "Proceding to register the user"}); return;
	    }
	    // Return if password is wrong
	    else if (!user.validPassword(req.body.password)) {
	        res.status(200).json({authlvl: -1, err: "Invalid pasword"}); return;
	    }
	    // If credentials are correct, return the user object
		console.log(user);
		res.status(200).json({authlvl: user.authlvl, token: user.generateJwt()}); // user found
		return;
	});
});

router.get('/callback', async (req, res) => {
	console.log(req.query.code);
	var userLog = await Google.getGoogleAccountFromCode(req.query.code);
	console.log("despues2");
	console.log(userLog);
	console.log("despues3");

	//register(userLog);
  	res.status(200).json(userLog);
  	return;
});

function register(userLog) {
  var user = new User();

  user.name = "";
  user.email = userLog.email;

  //user.setPassword(userLog.password);

  user.save();
  token = user.generateJwt();
  return token;
};

/* GET all users. */
router.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json(users);
		return;
	});
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {res.status(500).send(error); return;}

		res.status(200).json(user);
		return;
	});
});

/* Create a user. */
router.post('/users', (req, res) => {
	let user = new User({
		email: req.body.email,
		pass: req.body.pass,
		authlvl: 1
	});

	user.save(error => {
		if (error) {res.status(500).send(error); return;}

		res.status(201).json({message: 'User created successfully'});
		return;
	});
});

module.exports = router;
