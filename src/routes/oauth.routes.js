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
