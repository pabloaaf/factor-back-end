const { authService: service, userService } = require('../services');

const getUrl = async (req, res, next) => {
  try {
    const data = await service.getUrl();

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, pass } = await req.body;

    let doesUserExist = await userService.doesExist(email);

    let data;
    if(doesUserExist) {
      data = await userService.getByEmail(email);
      console.log("login by email", data);
      // Return if password is wrong
      if (!await userService.checkPassword(data, pass)) return res.json({authlvl: -1, err: "Invalid pasword"});
      // If credentials are correct, return the user object
      return res.json({authlvl: data.authlvl, token: await userService.generateJwt(data)}); // user found
    } else {
      return res.json({authlvl: 0, err: "Proceding to register the user"});
    }
  } catch (error) {
    return next(error);
  }
};

const callback = async (req, res, next) => {
  try {
    if(!req.body.code){
      res.status(404).json({message: 'no code'});
      return;
    }
    if(!req.body.pass){
      res.status(404).json({message: 'no pass'});
      return;
    }

    const data = await service.callback(req.body.code);

    let doesUserExist = await userService.doesExist(data.email);
    let user;
    if(doesUserExist) {
      user = await userService.getByEmail(data.email);
    } else {
      user = await userService.createResource(data, req.body.pass);
    }

    return res.json({authlvl: user.authlvl, token: await userService.generateJwt(user)});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUrl,
  login,
  callback
};
