var config = require('./config');
var express = require('express');
var helmet = require('helmet');
const bodyParser = require('body-parser');

//divide routes
const api = require('./routes/users');

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

// Set our api routes
app.use('/', api);

// Create an HTTP server to run our application
var server = app.listen(process.env.PORT, function () {
    console.log('Application port: ' + process.env.PORT);
});