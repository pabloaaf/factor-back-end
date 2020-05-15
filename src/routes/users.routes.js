const express = require('express');
const router = express.Router();

const { userController: controller } = require('../controllers');

/**
 * Route: /api/users
 */

router
	.route('/')
	//.get(controller.getMany) // ToDo Delete
	.get(controller.getProfessors); // param prof duplicated to read as array
	//.post(controller.createResource); // new in oauth

router
	.route('/:id')
	.get(controller.getOne) // ToDo first check token user equals user req
	.put(controller.updateResource) // unimplemented, change name, locale, picture add course
	.delete(controller.deleteResource); // ToDo first check token user equals user deletion

router
	.route('/:id/courses')
	.put(controller.updateCourses); // edit courses of user

module.exports = router;
