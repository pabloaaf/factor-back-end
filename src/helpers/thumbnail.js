// thumbnail.js
const exec = require('child_process').exec;
const Video = require("../models/videoModel");
//const ObjectID = require('mongodb').ObjectID
const fs = require("fs");


async function extract(path, destPath, time, size, callback) {
    if (time == null) {
      	time = '00:00:01';
    }
    if (size == null) {
      	size = '600x600';
    }
    return await exec('ffmpeg -ss ' + time + ' -i ' + path + ' -y -s ' + size + ' -vframes 1 -f image2 ' + destPath, function( err, stdout ) { //ss ' + time + ' -i ' + path + ' -y -s ' + size + ' -vframes 1 -f image2 ' + destPath
	    if (callback) {
	        return callback( err, stdout );
	    }
	    //console.log(stdout);
    });
}

// ffmpeg -i ./output/sample.mp4 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//
function duration(path, videoID) {
    return new Promise(async (resolve, reject) => {
    	let command = "ffmpeg -i "+ path +" 2>&1 | grep Duration | cut -d \' \' -f 4 | sed s/,//";
    	//console.log(command);
        await exec(command, async function( err, stdout ) {
            //console.log(stdout);
            let dur = stdout;
    	    await Video.findOneAndUpdate({_id: videoID}, {$set: {duration: dur}});
            resolve(path);
        });
    });
}

function extractAudio(path, destPath, videoID) {
    return new Promise(async (resolve, reject) => {
        //ffmpeg -i video.mp4 -acodec pcm_s16le -ac 1 -ar 8000 audio.wav
        let command = "ffmpeg -i "+ path +" -acodec pcm_s16le -ac 1 -ar 8000 "+ destPath;
        //console.log(command);
        await exec(command, function( err, stdout ) {
            if(err) reject(err);
            //console.log(stdout);
            resolve(destPath);
            //Video.findOneAndUpdate({_id: videoID}, {$push: {duration: stdout}});
        });
    });
}

module.exports = {
	extract: extract,
	duration: duration,
    extractAudio: extractAudio
};