module.exports = (req, res, next) => {
    res.locals.theme = req.cookies.theme ? req.cookies.theme : 'light';
    next();
};
