const express = require('express');
const router = express.Router();

const { authController: controller } = require('../controllers');

/**
 * Route: /api/auth
 */

router
	.route('/')
	.get(controller.getUrl) // google auth get url
	.post(controller.login); // confirm login

router
	.route('/callback')
	.post(controller.callback); // callback from google with the permissions code to request information of the user

module.exports = router;

/*
const User = require("../models/userModel.db");
const Google = require("../helpers/google-config");

/* google auth get url. * /
router.get('/', async (req, res) => {
	res.status(200).json(Google.urlGoogle());
});

/* confirm login. * /
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

/* callback from google with the permisions code to request information of the user. * /
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
	if(!tokenReg) res.status(500);
  	res.status(200).json({authlvl: userG.authlvl, token: tokenReg});
  	return;
});

function register(user,pass) {
	user.setPassword(pass);
	token = user.generateJwt();
	user.save(error => {
		if (error) {console.log(error); return;}
	});
	return token;
};
 */