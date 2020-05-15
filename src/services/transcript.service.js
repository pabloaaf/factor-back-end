const { TranscriptModel: Model } = require('../models');

const getOne = async id => {
  try {
    const doc = await Model.Transcript.find({videoID: id}).populate({path:'result', populate: [{path:'item'}]}).limit(1);

    //await TC.Transcript.findOne({videoID: req.body.id}).populate({path:'result', populate: [{path:'item'}]});
    return doc[0];
  } catch (error) {
    throw error;
  }
};

const doesExist = async id => {
  try {
    const doc = await Model.Transcript.find({videoID: id}).limit(1);
    return doc.length !== 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOne,
  doesExist
};
