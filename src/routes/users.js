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
	res.status(200).json({url: await Google.urlGoogle()});
});

/* confirm login. */
router.post('/login', (req, res) => {
	User.find(req.body.email, (err, user) => {
		if (!user) {
			res.status(200).json({authlvl: 0, err: "Proceding to register the user"});
		}
		if (!user.validPassword(password)) {
			res.status(200).json({authlvl: -1, err: "Invalid pasword"});
		}
		console.log(user);
		res.status(200).json({authlvl: user.authlvl, token: user.token}); // user found
	});
});

router.get('/callback', async (req, res) => {
	var userLog = await Google.getGoogleAccountFromCode(req.query.code);
	register(userLog);
  	res.status(200).json(userLog);
});

function register(userLog) {
  var user = new User();

  user.name = "";
  user.email = userLog.email;

  user.setPassword(userLog.password);

  user.save();
  token = user.generateJwt();
  return token;
};

/* GET all users. */
router.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if (err) res.status(500).send(error);

		res.status(200).json(users);
	});
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) res.status(500).send(error)

		res.status(200).json(user);
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
		if (error) res.status(500).send(error);

		res.status(201).json({message: 'User created successfully'});
	});
});

module.exports = router;
