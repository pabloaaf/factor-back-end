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

//router
	//.route('/:id/auth')
	//.put(controller.incraseAuth); // unimplemented, check user with plus 64 authlvl


/*
/* GET all users. * / //Delete in next reviews sino parsear array a min JWT
router.get('/', (req, res) => {
	User.find({}).select("-hash -salt").exec(function (err, users) {
		if (err) {res.status(500).send(err); return;}
		if (users) {
			res.status(200).json(users);
			return;
		}
	});
});

/* GET one user. * /
router.get('/:id', (req, res) => {
	User.findById(req.params.id).select("-hash -salt").exec(function (err, user) {
		if (err) {res.status(500).send(err); return;}
		if (user) {
			if(!user.courses) {
				user.courses = [];
			}
			res.status(200).json(user);
			return;
		}
	});
});

/* GET info of an array of professor ID. (ask by student so professors only show name) * /
router.post('/id', (req, res) => {
	User.find({'_id': { $in: req.body.id}}).select("family_name given_name").exec(function (err, profs) {
		if (err) {res.status(500).json(err); return;}
		if (profs) {
			let listProfs=[];
			for (var i = 0; i <= req.body.id.length - 1; i++) {
				for (var j = 0; j <= req.body.id.length - 1; j++) {
					if(profs[j]._id == req.body.id[i]){
						listProfs.push(profs[j]);
						break;
					}
				}
			}
			res.status(200).json(listProfs);
			return;
		}
	});
});

/* POST add course to user. * /
router.post('/', (req, res) => {
	User.findOneAndUpdate({_id: req.body.user}, {$push: {coursesID: req.body.course}}).select("-hash -salt").exec(function (err, user) {
		if (err) {res.status(500).send(err); return;}
		if (user) {
			res.status(200).json({message: 'course saved into user', user:user});
			return;
		}
		return;
	});
});
*/