const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Check for token
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            throw new Error();
        }
        console.log('TOKEN SENT FROM CLIENT', token);

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        // Add user from jwt payload
        req.user = decoded;

        console.log('[REQ.USER]', req.user);

        next();
    } catch (error) {
        console.log(error);
      if (!error.status) {
        error.status = 401;
        error.message = 'Token is unauthorized';
        error.name = 'TokenUnauthorized';
      }
      next(error);
    }
};

module.exports = auth;
