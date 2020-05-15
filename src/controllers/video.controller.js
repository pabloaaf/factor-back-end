const { videoService: service, transcriptService } = require('../services');

const createResource = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const { video } = req.files;

    //ToDo Check not same video stored same course

    // Place the file into the route of the server
    let staticsInfo = {
      serverPath: '/'+process.env.DIR_STATICS,
      internCPath: '/classes/'+req.body.course+'/',
      internTPath: '/pictures/'+req.body.course+'/',
      internAPath: '/audios/'+req.body.course+'/',
      finalName: 'class-'+Date.now()+'-'+video.name.split('.')[0],
      videoExtension: 'mp4',
      audioExtension: 'wav',
      picExtension: 'png'
    };

    // Verify file .mp4
    if(video.name.split('.').slice(-1)[0].toLowerCase() !== staticsInfo.videoExtension){
      return res.status(400).send('file type not mp4');
    }

    video.mv(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension, function(err) {
      if (err) return res.status(500).send(err);
      //res.send('File uploaded!');
    });

    const courseVideos = await service.getMany({'courseID': req.body.course});
    let classVideoNum = courseVideos.length;

    // Create Thumbnail
    const thumbnailCorrect = service.generateThumbnail(
        staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension,
        staticsInfo.serverPath+staticsInfo.internTPath+staticsInfo.finalName+'.'+staticsInfo.picExtension,
        '00:00:22', '300x225');

    if(!thumbnailCorrect) {
      const error = new Error();
      error.name = 'VideoTooShort';
      throw error;
    }

    // Retrieve data
    const data = await service.createResource({
      name: req.files.video.name,
      url: process.env.DIR_STATICS+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension,
      duration: 0, //time video added later
      class: classVideoNum,
      thumbnail: process.env.DIR_STATICS+staticsInfo.internTPath+staticsInfo.finalName+'.'+staticsInfo.picExtension,
      courseID: req.body.course
    });

    // response user upload
    res.status(200).json(data);

    Promise.resolve(data._id)
      .then(async objID => {
        // Save video duration
        console.log("Extract duration");
        console.log(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension);
        console.log(objID);
        const duration = await service.getDuration(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension);
        console.log("transcription process, extract duration: ", duration); // Verify
        const doc = await service.updateResource(objID, {duration: duration});

        return doc._id;
      }).then(async objID => {
        // Save audio best quality ==> wav from video
        console.log("Extract audio");
        console.log(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension);
        console.log(staticsInfo.serverPath+staticsInfo.internAPath+staticsInfo.finalName+'.'+staticsInfo.audioExtension);
        console.log(objID);

        return await service.splitAudio(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension, staticsInfo.serverPath+staticsInfo.internAPath+staticsInfo.finalName+'.'+staticsInfo.audioExtension);
        //return await Thumbnail.extractAudio(staticsInfo.serverPath+staticsInfo.internCPath+staticsInfo.finalName+'.'+staticsInfo.videoExtension, staticsInfo.serverPath+staticsInfo.internAPath+staticsInfo.finalName+'.'+staticsInfo.audioExtension, objID);
      }).then(async splitOut => {
        console.log("Send audio to S3 bucket");
        console.log(splitOut);
        return await service.storeAudioToBucket(staticsInfo.serverPath+staticsInfo.internAPath+staticsInfo.finalName+'.wav');
      }).then(async name => {
        console.log("Transcribe job");
        console.log(name);
        return await service.transcribeAudio(name);
      }).then(async transcription_result => {
        console.log("Retrieve audio");
        console.log(transcription_result);
        let response;
        do {
          await new Promise(r => setTimeout(r, 10000));
          response = await service.lookupTranscribeCompletion(transcription_result);
          console.log("Still waiting");
          console.log(response.TranscriptionJob.TranscriptionJobStatus);
        }
        while (response.TranscriptionJob.TranscriptionJobStatus === "IN_PROGRESS");
        return response.TranscriptionJob.Transcript.TranscriptFileUri;
      }).then(async transcripts => {
        console.log("Store Transcripts");
        console.log(transcripts);
        let route = transcripts.split("/");
        let name = route[route.length - 1];
        let audio = await service.retrieveTranscribedAudio(name);
        console.log(audio);
        let json = JSON.parse(audio.Body);
        await service.saveTranscripts(json, data._id);
        console.log("ended");
      }).catch(err => console.log(err));

    return;
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.getOne(id);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const getOneTranscription = async (req, res, next) => {
  try {
    const { id } = await req.params;

    let doesTranscriptExist = await transcriptService.doesExist(id);
    let data;
    if(doesTranscriptExist) {
      data = await transcriptService.getOne(id);
    } else {
      data = {};
    }

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const getMany = async (req, res, next) => {
  try {
    const data = await service.getMany(req.query);

    return res.json(data);
  } catch (error) {
    //res.sendStatus(500);
    return next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.updateResource(id, req.body);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.deleteResource(id);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createResource,
  getOne,
  getOneTranscription,
  getMany,
  updateResource,
  deleteResource
};
