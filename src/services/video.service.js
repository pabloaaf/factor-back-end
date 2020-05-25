const { VideoModel: Model } = require('../models');
const { awsTranscribe: AWS } = require("../helpers");
const { isEntryEmpty, getSchemaKeys, entryContainsSchema } = require('../helpers');
const exec = require('child_process').exec;

const createResource = async newDoc => {
  const schemaKeys = getSchemaKeys(Model);
  await isEntryEmpty(newDoc);
  await entryContainsSchema(newDoc, schemaKeys);

  newDoc = new Model(newDoc);
  await newDoc.validateSync();
  let doc = await newDoc.save();

  return doc;
};

const getOne = async id => {
  try {
    const doc = await Model.findById(id);

    return doc;
  } catch (error) {
    throw error;
  }
};

const getByEmail = async email => {
  try {
    const doc = await Model.find({ email }).limit(1);

    return doc[0];
  } catch (error) {
    throw error;
  }
};

const getMany = async query => {
  try {
    console.log(query);

    const docs = await Model.find(query).select("name duration thumbnail class courseID").sort({class: "asc"});

    return docs;
  } catch (error) {
    throw error;
  }
};

const updateResource = async (id, modifications) => {
  try {
    await isEntryEmpty(modifications);
    let updatedDoc = await getOne(id);
    if(modifications["course"]) {
      updatedDoc.course = modifications.course;
    }
    if(modifications["name"]) {
      updatedDoc.name = modifications.name;
    }
    if(modifications["duration"]) {
      updatedDoc.duration = modifications.duration;
    }

    const doc = await Model.findByIdAndUpdate(
      id,
      { $set: updatedDoc },
      { runValidators: true, new: true }
    );

    return doc;
  } catch (error) {
    throw error;
  }
};

const deleteResource = async id => {
  try {
    const doc = await Model.findByIdAndRemove(id);

    return doc;
  } catch (error) {
    throw error;
  }
};

const doesExist = async incomingDoc => {
  try {
    const doc = await Model.find({ email: incomingDoc.email });

    if (doc.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const generateThumbnail = async (path, destPath, time, size) => {
  try {
    if (time == null) {
      time = '00:00:01';
    }
    if (size == null) {
      size = '600x600';
    }
    await exec('ffmpeg -ss ' + time + ' -i ' + path + ' -y -s ' + size + ' -vframes 1 -f image2 ' + destPath, function( err, stdout ) { //ss ' + time + ' -i ' + path + ' -y -s ' + size + ' -vframes 1 -f image2 ' + destPath
      if(err) throw err;
      console.log('snapshot saved');
      console.log(stdout);
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getDuration = (path) => {
  return new Promise(async (resolve, reject) => {
    let command = "ffmpeg -i "+ path +" 2>&1 | grep Duration | cut -d \' \' -f 4 | sed s/,//";
    //console.log(command);
    await exec(command, async function( err, stdout ) {
      if(err) reject(err);
      //console.log(stdout);
      resolve(stdout);
    });
  });
};

const splitAudio = async (path, destPath) => {
  return new Promise(async (resolve, reject) => {
    //ffmpeg -i video.mp4 -acodec pcm_s16le -ac 1 -ar 8000 audio.wav // Change from 8000 to 16000 for DeepSpeech trial
    let command = "ffmpeg -i "+ path +" -acodec pcm_s16le -ac 1 -ar 8000 "+ destPath;
    //console.log(command);
    await exec(command, function( err, stdout ) {
      if(err) reject(err);
      //console.log(stdout);
      resolve(stdout);
      //Model.findOneAndUpdate({_id: videoID}, {$push: {duration: stdout}});
    });
  });
};

const storeAudioToBucket = async path => {
  try {
    return await AWS.storeAudioToBucket(path);
  } catch (error) {
    throw error;
  }
};

const transcribeAudio = async name => {
  try {
    return await AWS.transcribeAudio(name);
  } catch (error) {
    throw error;
  }
};

const lookupTranscribeCompletion = async transcription_result => {
  try {
    return await AWS.lookupTranscribeCompletion(transcription_result);
  } catch (error) {
    throw error;
  }
};

const retrieveTranscribedAudio = async name => {
  try {
    return await AWS.retrieveTranscribedAudio(name);
  } catch (error) {
    throw error;
  }
};

const saveTranscripts = async (json, objID) => {
  try {
    return await AWS.saveTranscripts(json, objID);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createResource,
  getOne,
  getByEmail,
  getMany,
  updateResource,
  deleteResource,
  doesExist,
  generateThumbnail,
  getDuration,
  splitAudio,
  storeAudioToBucket,
  transcribeAudio,
  lookupTranscribeCompletion,
  retrieveTranscribedAudio,
  saveTranscripts
};
