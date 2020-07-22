const configurableAuthLvlCheck = (options) => {
    return (req, res, next) => {
        try {
            if(req.user.authlvl >= options && req.user.authlvl < 128){ // if >= higher could access lower if(Number(req.user.authlvl) === options){ //if(options.includes(Number(req.user.authlvl))){ multiauth
                next();
            } else{
                throw new Error();
            }
        } catch (error) {
            if (!error.status) {
                error.status = 401;
                error.message = 'Ask for more permission';
                error.name = 'TokenUnauthorized';
            }
            next(error);
        }
    };
};
module.exports = configurableAuthLvlCheck;
