//aws-transcribe.js
const AWS = require("aws-sdk");

let myConfig = new AWS.Config();
myConfig.update({region: 'us-east-1'});

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});

console.log("Region: ", AWS.config.region);


//s3 = new AWS.S3(s3.config);
