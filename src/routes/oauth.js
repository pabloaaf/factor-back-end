// Import dependencies
const express = require('express');
const router = express.Router();

const User = require("../models/userModel");
const Google = require("../helpers/google-config");

/* google auth get url. */
router.get('/oauth', async (req, res) => {
	res.status(200).json(Google.urlGoogle());
});

/* confirm login. */
router.post('/login', (req, res) => {
	//console.log(req.body.email);
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) {res.status(500).send(err); return;}
	    // Return if user not found in database
	    if (!user) {res.status(200).json({authlvl: 0, err: "Proceding to register the user"}); return;}
	    // Return if password is wrong
	    if (!user.validPassword(req.body.pass)) {res.status(200).json({authlvl: -1, err: "Invalid pasword"}); return;}
	    // If credentials are correct, return the user object
		//console.log(user);
		res.status(200).json({authlvl: user.authlvl, token: user.generateJwt()}); // user found
		return;
	});
});

/* callback from google with the permisions code to request information of the user. */
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
		if (err) {res.status(500).send(err); return;}
	    // Return if user not found in database
	    if (user) {
	    	//console.log(user);
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

module.exports = router;