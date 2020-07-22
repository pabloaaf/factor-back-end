const express = require('express');
const router = express.Router();

const { userController: controller } = require('../controllers');
const middleware = require('../middleware');

/**
 * Route: /api/users
 */

router
	.route('/')
	//.get(controller.getMany) // ToDo Delete
	.get(middleware.lvlCheck(1), controller.getProfessors); // param prof duplicated to read as array
	//.post(controller.createResource); // new in oauth

router
	.route('/:id')
	.get(middleware.lvlCheck(1), controller.getOne) // ToDo first check token user equals user req
	.put(middleware.lvlCheck(1), controller.updateResource) // unimplemented, change name, locale, picture add course
	.delete(middleware.lvlCheck(1), controller.deleteResource); // ToDo first check token user equals user deletion

router
	.route('/:id/courses')
	.put(middleware.lvlCheck(127), controller.updateCourses); // edit courses of user

module.exports = router;
