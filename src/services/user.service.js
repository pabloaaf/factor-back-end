const { UserModel: Model } = require('../models');
const { isEntryEmpty } = require('../helpers');

const createResource = async (newDoc, password) => {
  await isEntryEmpty(newDoc);

  let exists = await doesExist(newDoc.email);
  if (exists) {
    const error = new Error();
    error.name = 'UserAlreadyExist';
    throw error;
  }
  newDoc = new Model(newDoc);
  newDoc.setPassword(password);

  await newDoc.validateSync();
  let doc = await newDoc.save();

  return doc;
};

const getOne = async id => {
  try {
    const doc = await Model.findById(id).select("-hash -salt");

    return doc;
  } catch (error) {
    throw error;
  }
};

const getOneComplete = async id => {
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

const getProfessors = async query => {
  try {
    const docs = await Model.find({'_id': { $in: query}}).select("family_name given_name email");

    // ensure only return professors
    for (let i = 0; i < docs.length; i++) {
      if(docs[i].email.split("@").pop() === "iit.edu") {
        delete docs[i].email;
      } else {
        docs.splice(i,1);
      }
    }

    return docs;
  } catch (error) {
    throw error;
  }
};

const getNull = async () => {
  try {
    const doc = new Model({gId:0, email:"a"});

    return doc;
  } catch (error) {
    throw error;
  }
};

const updateResource = async (id, modifications) => {
  try {
    await isEntryEmpty(modifications);
    let updatedDoc = await getOneComplete(id);
    if(modifications["family_name"]) {
      updatedDoc.family_name = modifications.family_name;
    }
    if(modifications["given_name"]) {
      updatedDoc.given_name = modifications.given_name;
    }
    if(modifications["locale"]) {
      updatedDoc.locale = modifications.locale;
    }
    if(modifications["picture"]) {
      updatedDoc.picture = modifications.picture;
    }
    if(modifications["coursesID"]) {
      updatedDoc.coursesID.push(modifications.coursesID); // only add courses
    }
    if(modifications["authlvl"]) {
      updatedDoc.authlvl = modifications.authlvl;
    }

    const doc = await Model.findByIdAndUpdate(
        id,
        { $set: updatedDoc },
        { runValidators: true, new: true }
    ).select("-hash -salt");

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

const doesExist = async email => {
  try {
    const doc = await Model.find({email:email});
    return doc.length !== 0;
  } catch (error) {
    throw error;
  }
};

const checkPassword = async (doc, pass) => {
  try {
    return doc.validPassword(pass);
  } catch (error) {
    throw error;
  }
};

const generateJwt = async (doc) => {
  try {
    return doc.generateJwt();
  } catch (error) {
    throw error;
  }
};

const generateNullJwt = async () => {
  try {
    const doc = getNull();
    return doc.generateNullJwt();
  } catch (error) {
    throw error;
  }
};

const getMany = async query => { // DELETE END
  try {
    const endQuery = {...query, ...{authlvl: {$ne: 127}} };
    console.log(endQuery);
    const docs = await Model.find(endQuery).select("family_name given_name email authlvl");

    return docs;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createResource,
  getOne,
  getByEmail,
  getProfessors,
  updateResource,
  deleteResource,
  doesExist,
  checkPassword,
  generateJwt,
  generateNullJwt,
  getMany
};
