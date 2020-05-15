const { CourseModel: Model } = require('../models');
const { isEntryEmpty, getSchemaKeys, entryContainsSchema } = require('../helpers');
const fs = require('fs');

const createResource = async newDoc => {
  const schemaKeys = getSchemaKeys(Model);
  await isEntryEmpty(newDoc);
  await entryContainsSchema(newDoc, schemaKeys);

  let exists = await doesExist(newDoc.number);
  if (exists) {
    const error = new Error();
    error.name = 'CourseAlreadyExist';
    throw error;
  }

  newDoc = new Model(newDoc);
  await newDoc.validateSync();
  let doc = await newDoc.save();

  // Create folders for the data
  createFolder(process.env.DIR_STATICS+'/classes/'+doc._id);
  createFolder(process.env.DIR_STATICS+'/pictures/'+doc._id);
  createFolder(process.env.DIR_STATICS+'/audios/'+doc._id);

  return doc;
};

// Takes folder path and adds the base directory before creating the folder
const createFolder = folderPath => {
  let path = "/" + folderPath + "/";
  console.log(path);
  fs.mkdir(path, { recursive: true }, function(event, err){
    if (err) throw new Error(err);
    if (event === null) {
      console.log("Created a folder at " + path);
    }
  });
};

const getOne = async id => {
  try {
    const doc = await Model.findById(id);

    return doc;
  } catch (error) {
    throw error;
  }
};

const getByNumber = async id => {
  try {
    const doc = await Model.find({});

    return doc;
  } catch (error) {
    throw error;
  }
};

const getMany = async query => {
  try {
    console.log(query);

    const docs = await Model.find(query);

    return docs;
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
    const doc = await Model.find({ number: incomingDoc.number });

    return doc.length !== 0;
  } catch (error) {
    throw error;
  }
};

/*const getByEmail = async email => {
  try {
    const doc = await Model.findOne({ email });

    return doc;
  } catch (error) {
    throw error;
  }
};*/

/*const updateResource = async (id, updatedDoc) => {
  const schemaKeys = getSchemaKeys(Model);

  await isEntryEmpty(updatedDoc);

  await entryContainsSchema(updatedDoc, schemaKeys);

  try {
    const doc = await Model.findByIdAndUpdate(
      id,
      { $set: updatedDoc },
      { runValidators: true, new: true }
    );

    return doc;
  } catch (error) {
    throw error;
  }
};*/

module.exports = {
  createResource,
  getOne,
  //getByEmail,
  getMany,
  //updateResource,
  deleteResource,
  doesExist
};
