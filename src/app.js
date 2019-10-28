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
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Set our api routes
app.use('/', api);

// Create an HTTP server to run our application
var server = app.listen(config.PORT, function () {
    console.log('Application port: ' + config.PORT);
});