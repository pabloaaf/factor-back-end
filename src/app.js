var config = require('./helpers/config');
var express = require('express');
var helmet = require('helmet');
const bodyParser = require('body-parser');
const Mongo = require("./helpers/mongoConnexion");

//divide routes
const usersR = require('./routes/users');
const loginR = require('./routes/oauth');

// Create an Express web app
var app = express();

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

//Initialize Mongo DB
Mongo.connectWithRetry();

// Set our api routes
/* usersR listing. */
app.use('/', usersR);
/* loginR listing. */
app.use('/', loginR);
// Serve folder static resources
app.use('/assets', express.static('assets')); 

// Create an HTTP server to run our application
var server = app.listen(process.env.PORT, function () {
    console.log('Application port: ' + process.env.PORT);
});