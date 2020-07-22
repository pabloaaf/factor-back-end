const express = require('express');
const router = express.Router();

const { courseController: controller } = require('../controllers');
const middleware = require('../middleware');

/**
 * Route: /api/courses
 */

router
	.route('/')
	.get(middleware.lvlCheck(1), controller.getMany) // ToDo admin page use it {}, unimplemented, check token and normal users require with an array of courses
	.post(middleware.lvlCheck(127), controller.createResource);

router
	.route('/:id')
	.get(middleware.lvlCheck(1), controller.getOne) // ToDo first check token user equals user req
	//.put(controller.updateResource) // unimplemented, change name, number
	.delete(middleware.lvlCheck(1), controller.deleteResource); // ToDo first check token user equals admin

module.exports = router;