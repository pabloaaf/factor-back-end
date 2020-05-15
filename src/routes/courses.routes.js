const express = require('express');
const router = express.Router();

const { courseController: controller } = require('../controllers');

/**
 * Route: /api/courses
 */

router
	.get('/', controller.getMany) // ToDo admin page use it {}, unimplemented, check token and normal users require with an array of courses
	.post('/', controller.createResource);

router
	.route('/:id')
	.get(controller.getOne) // ToDo first check token user equals user req
	//.put(controller.updateResource) // unimplemented, change name, number
	.delete(controller.deleteResource); // ToDo first check token user equals admin

router.get('/videos', controller.getVideos); // videos of the same course ordered by class number

module.exports = router;