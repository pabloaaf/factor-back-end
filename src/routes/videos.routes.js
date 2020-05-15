const express = require('express');
const router = express.Router();

const { videoController: controller } = require('../controllers');

/**
 * Route: /api/videos
 */

router
	.route('/')
	// .get(controller.getMany)
	.post(controller.createResource);

router
	.route('/:id')
	.get(controller.getOne)
	.put(controller.updateResource)
	.delete(controller.deleteResource);

router
	.route('/:id/transcriptions')
	.get(controller.getOneTranscription);

module.exports = router;