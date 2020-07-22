const Mongoose = require('mongoose');
var crypto = require('crypto');

const CourseModel = require('./course.db');
const TranscriptModel = require('./transcript.db');
const UserModel = require('./user.db');
const VideoModel = require('./video.db');

/*Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false, replicaSet: "rs0" })
  .then(() => {console.log('[MONGODB]: MongoDB Connected')})
  .catch(error => {console.log('[MONGODB]:', error)});
*/
Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('[MONGODB]: MongoDB Connected');
    await initial();
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log('[MONGODB]:', error);
  });

const initial = async () => {
  // Check db empty
  let clean = await UserModel.countDocuments();
  console.log('[MONGODB]:', clean);
  if(clean == 0){
    // new first run password
    let managerKey = crypto.randomBytes(16).toString('hex');
    console.log("[Manager Key]:", managerKey);
    let doc = new UserModel({email:"role@role.me", gId: 318256538240300, family_name:"NA", given_name:"NA", authlvl: 127});
    doc.setPassword(managerKey);
    await doc.save();

    // new iddle professor delete later
    let docProf = new UserModel({
    	coursesID: [],
    	gId: 5142546438240000,
    	email: 'professor@iit.edu',
    	family_name: 'Test',
    	given_name: 'Prof',
    	locale: 'en',
    	picture: 'https://lh4.googleusercontent.com/-6Vtnbx49D4Y/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmdupdr1iclwT5Vd4JMTJ8XVtON-Q/photo.jpg',
    	verified_email: true,
    	authlvl: 64,
    	salt: '7135f144757f05ea702d08e6f0ce417e',
    	hash: 'bf96f9704263db0e59a1f27e40bb19c3991e1b25b6a9d178184e91bfe9edbd9d36c482b7619608966b47965d990b07de276c31a84a80109e0331dde1c8c85b79',
	});
	await docProf.save();
  }
};

module.exports = {
  CourseModel,
  TranscriptModel,
  UserModel,
  VideoModel
};
