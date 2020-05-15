// const config = require('./helpers/config');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandlerMiddleware = require('./middleware/errorHandler.middleware');

// Create an Express web app
const app = express();

// Security protection
app.use(helmet());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin middleware
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'); // Content-Type
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

// MongoDB Connection
require('./models');

// Route /api to Routes directory
app.use('/api', routes);

// Error Handler
app.use(errorHandlerMiddleware);

// Create an HTTP server to run our application
app.listen(process.env.PORT, () => { console.log('Application port: ' + process.env.PORT) });


//divide routes
/*const loginR = require('./routes/oauth');
const usersR = require('./routes/users');
const coursesR = require('./routes/courses');
const videosR = require('./routes/videos');*/

//const Mongo = require("./helpers/mongoConnexion");
//Initialize Mongo DB
//Mongo.connectWithRetry();