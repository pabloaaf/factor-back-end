const errorHandler = require("./errorHandler.middleware");
const authMiddleware = require('./auth.middleware');
const lvlCheck = require('./authLvl.middleware');

module.exports = {
  errorHandler,
  authMiddleware,
  lvlCheck
};
