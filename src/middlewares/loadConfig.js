const config = require('../../config');

const loadConfig = (req, res, next) => {
    res.locals.config = config;
    next();
};

module.exports = loadConfig;
