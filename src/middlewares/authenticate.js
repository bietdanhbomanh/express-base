const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { showLogin } = require('../utils/show');

module.exports = async (req, res, next) => {
    if (req.session.userId) {
        const user = await userModel.findById(req.session.userId);
        req.user = user;
        if (user.type) {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, process.env.KEY, async (err, data) => {
                if (data.ip === req.ip) {
                    req.session.userId = data.userId;
                    const user = await userModel.findById(req.session.userId);
                    req.user = user;
                    if (user.type) {
                        next();
                    } else {
                        res.redirect('/');
                    }
                }
            });
        } else {
            showLogin(res);
        }
    }
};
