// mongoConnexion.js
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoUrl = 'mongodb://database/mean-docker';

function connectWithRetry() {
    return mongoose.connect(mongoUrl, function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
}

module.exports = {connectWithRetry};