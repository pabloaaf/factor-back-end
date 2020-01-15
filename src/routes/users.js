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
		if (err) {res.status(500).send(error); return;}
	    // Return if user not found in database
	    if (!user) {res.status(200).json({authlvl: 0, err: "Proceding to register the user"}); return;}
	    // Return if password is wrong
	    if (!user.validPassword(req.body.pass)) {res.status(200).json({authlvl: -1, err: "Invalid pasword"}); return;}
	    // If credentials are correct, return the user object
		console.log(user);
		res.status(200).json({authlvl: user.authlvl, token: user.generateJwt()}); // user found
		return;
	});
});

router.post('/callback', async (req, res) => {
	//console.log(req.body.code);
	if(!req.body.code){
		res.status(404).json({message: 'no code'});
		return;
	}
	if(!req.body.pass){
		res.status(404).json({message: 'no pass'});
		return;
	}
	var userG = await Google.getGoogleAccountFromCode(req.body.code);

	User.findOne({ email: userG.email }, function (err, user) {
		if (err) {res.status(500).send(error); return;}
	    // Return if user not found in database
	    if (user) {
	    	console.log(user);
			res.status(200).json({authlvl: user.authlvl, token: user.generateJwt()}); // user found
			return;
	    }
	});

	var tokenReg = register(userG, req.body.pass);
  	res.status(200).json({authlvl: userG.authlvl, token: tokenReg});
  	return;
});

function register(user,pass) {
  user.setPassword(pass);
  token = user.generateJwt();
  user.save(error => {
	if (error) {res.status(500).send(error); return;}
  });
  return token;
};

/* GET all users. */ //Delete in next reviews
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

module.exports = router;