const express = require('express');
const router = express.Router();

const { videoController: controller } = require('../controllers');
const middleware = require('../middleware');

/**
 * Route: /api/videos
 */

router
	.route('/')
	.get(middleware.lvlCheck(1), controller.getVideos)
	.post(middleware.lvlCheck(1), controller.createResource);

router
	.route('/:id')
	.get(middleware.lvlCheck(1), controller.getOne)
	.put(middleware.lvlCheck(1), controller.updateResource)
	.delete(middleware.lvlCheck(1), controller.deleteResource);

router
	.route('/:id/transcriptions')
	.get(middleware.lvlCheck(1), controller.getOneTranscription);

module.exports = router;