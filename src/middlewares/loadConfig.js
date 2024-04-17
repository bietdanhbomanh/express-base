const roles = require('../../config/role');

module.exports = (req, res, next) => {
    const config = {
        theme: req.cookies.theme ? req.cookies.theme : 'light',
    };
    
    res.locals.roles = roles
    if(req.session.toast) {
        res.locals.toast = req.session.toast;
        req.session.toast = '';
    }

    Object.assign(res.locals, { config });
    next();
};
