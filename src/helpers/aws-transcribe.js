//aws-transcribe.js
const AWS = require("aws-sdk");
const fs = require("fs");
const TC = require("../models/transcriptModel");

//let awsConfig = new AWS.Config();
const AWSConfig = {
	region: process.env.AWS_REGION, // This is the only AWS region outside the US that supports transcribe API
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}; // sslEnabled: true, // This is optional

const s3 = new AWS.S3(AWSConfig);
AWS.config.update({region: 'us-east-1'});
const transcribe = new AWS.TranscribeService(AWSConfig);

function storeAudioToBucket(path) {
	return new Promise((resolve, reject) => {
		console.log(path);

		// Read content from the file
		const fileContent = fs.readFileSync(path+'');
	   
	    let audioName = path.split("/");
		console.log(audioName[audioName.length - 1]);

	    // Setting up S3 upload parameters
        const params = {
            Body: fileContent,
            Bucket: process.env.S3_AUDIO_BUCKET,
            Key: audioName[audioName.length - 1],
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            else {
            	console.log(data);
                resolve(params.Key);
            }
        });
    });
}

function transcribeAudio(audioName) {
	return new Promise((resolve, reject) => {
		const s3URL = 'https://s3.amazonaws.com/' + process.env.S3_AUDIO_BUCKET + "/";
        //let finalName = audioName.replace(/./g,"");
        let finalName = audioName;
        console.log(finalName);
        finalName = finalName.replace(/_/g,"");
        console.log(finalName);
        finalName = finalName.substring(0,59);
        console.log(finalName);
        const params = {
			LanguageCode: 'en-US',
			Media: {MediaFileUri: s3URL +audioName+ ""},
			MediaSampleRateHertz: 8000,
			MediaFormat: 'wav',
			TranscriptionJobName: "job"+finalName,
			OutputBucketName: process.env.S3_AUDIO_BUCKET
	  	};
        transcribe.startTranscriptionJob(params, function (err, data) {
	        if (err) {
	            console.log(err, err.stack);
	            reject(err);
	        }
	        else {
	            resolve(data);
	        }
	    });
	});
}

function lookupTranscribeCompletion(transcript) {
	return new Promise((resolve, reject) => {
		const transcription = (typeof transcript === 'string' || transcript instanceof String) ? transcript : transcript.TranscriptionJob.TranscriptionJobName;
		
		const params = {
	        TranscriptionJobName: transcription,
	    };

	    transcribe.getTranscriptionJob(params, function (err, data) {
	        if (err) {
	            console.log(err, err.stack);
	            reject(err);
	        }
	        else {
	        	console.log(data);
	            resolve(data);
	        }
	    });
	});
}

function retrieveTranscribedAudio(transcript) {
	return new Promise((resolve, reject) => {
		s3.getObject({ Bucket: process.env.S3_AUDIO_BUCKET, Key: transcript },
			function (error, data) {
				if (error != null) {
			    	console.log("Failed to retrieve an object: " + error);
			    	reject(error);
			    } else {
			      	console.log("Loaded " + data.ContentLength + " bytes");
			      	// do something with data.Body
			      	resolve(data);
			    }
			}
		);
	});
}

async function saveTranscripts(data, videoID) {
	//console.log(data);
	console.log(data.results.items[0].alternatives);

	let itemCollection = [];
	for (let i = 0; i < data.results.items.length; i++) {
		let typeI = data.results.items[i].type;
		let alternativesI = [];
		for (let j = 0; j < data.results.items[i].alternatives.length; j++) {
			//console.log(data.results.items[i].alternatives[j].confidence);
			await alternativesI.push({
				confidence: data.results.items[i].alternatives[j].confidence,
				content: data.results.items[i].alternatives[j].content
			});
		}
		let itemI;
		if(typeI == "punctuation"){
			itemI = await new TC.Item({
				alternatives: data.results.items[i].alternatives,
				type: typeI,
			});
		} else {
			itemI = await new TC.Item({
				start_time: data.results.items[i].start_time,
				end_time: data.results.items[i].end_time,
				alternatives: data.results.items[i].alternatives,
				type: typeI,
			});
		}
		let itemF = await itemI.save();
		await itemCollection.push(itemF._id);
	}

	let resultI = await new TC.Result({
		transcripts: data.results.transcripts[0].transcript,
		item: itemCollection
	});
	let resultF = await resultI.save();
	//console.log(resultF);
	let tcript = await new TC.Transcript({
		jobName: data.jobName,
		accountID: data.accountId,
		result: resultF._id,
		videoID: videoID
	});

	//console.log(tcript);

	await tcript.save();
}

module.exports = {
    storeAudioToBucket,
    transcribeAudio,
    lookupTranscribeCompletion,
    retrieveTranscribedAudio,
    saveTranscripts
};