/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(422).json({
      name: error.name,
      message: error._message,
      formatted: errorsFormatter(error)
    });
  }

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(404).json({
      name: 'InvalidID',
      message: 'ID does not exist'
    });
  }

  if (error.name === 'CastError' && error.kind === 'number') {
    return res.status(422).json({
      message: 'Entry data is not valid',
      name: 'InvalidEntry'
    });
  }

  if (error.name === 'InvalidEntry') {
    return res.status(422).json(error);
  }
  if (error.name === 'TokenUnauthorized') {
    return res.status(error.status).json({message: error.message});
  }

  if (error.message === 'Expected "payload" to be a plain object.') {
    return res.status(400).json({
      message: 'Server failed to sign auth token',
      name: 'AuthTokenFailed'
    });
  }

  if (error.name === 'UserAlreadyExist') {
    return res.status(409).json({
      message: 'User already exist',
      name: 'UserAlreadyExist'
    });
  }

  if (error.name === 'GoogleIdTokenVerificationFailed') {
    console.log(error.message);
    if (error.message.includes('Token used too late')) {
      error.message = 'Google ID token used too late';
    }
    if (error.message.includes('invalid_token')) {
      error.message = 'Google token is invalid';
    }
    return res.status(400).json({
      message: error.message,
      name: error.name
    });
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return res.status(500).json({
      name: error.name || 'InternalServerError',
      message: error.message || 'Internal server error',
      status: error.status
    });
  }
  next(error);
};

const errorsFormatter = error => {
  const errorsObj = error.errors;
  const errorFields = Object.keys(errorsObj);
  const errors = errorFields.map(err => {
    const { message, kind, path, value } = errorsObj[err];
    return {
      message: message.replace('Path', 'Field').replace('path', 'field'),
      validationType: kind,
      fieldName: path,
      value
    };
  });
  return errors;
};

module.exports = errorHandler;
