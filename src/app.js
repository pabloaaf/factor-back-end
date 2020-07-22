const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { errorHandler } = require('./middleware');
const cors = require('cors');

// Create an Express web app
const app = express();
const port = process.env.PORT || 3000;

console.log('Sample environment variable:', process.env.SAMPLE);

// Security protection
app.use(helmet());

// Body parser
app.use(express.json());
app.use(cors());

// MongoDB Connection
require('./models');

// Route /api to Routes directory
app.use('/', routes);

// Error Handler
app.use(errorHandler);

// Create an HTTP server to run our application
app.listen(port, () => { console.log('Application port: ' + port) });