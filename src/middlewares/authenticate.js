const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        let user = '';
        if (userId) {
            user = await userModel.findById(userId);
        } else {
            if(req.cookies.token){
                const token = await jwt.verify(req.cookies.token, process.env.KEY);
                if (token && token.ip === req.ip) {
                    user = await userModel.findById(token.userId);
                    req.session.userId = user._id.toString();
                    res.cookie('token', req.cookies.token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 24 * process.env.COOKIEEXPIRES * 3600000),
                    });
                }
            } else {
                req.session.userId = '';
                res.clearCookie('token');
                req.session.toast = {
                    type: 'error',
                    title: 'Lỗi xác thực',
                    content: 'Bạn dã đăng xuất hoặc bị hết hạn phiên mới đăng nhập lại',
                };
                throw new Error()
            }
        }
        if(user){
            res.locals.user = user;
            next();
        } else {
            req.session.userId = '';
            res.clearCookie('token');
            req.session.toast = {
                type: 'error',
                title: 'Lỗi xác thực',
                content: 'Tài khoản đã bị xóa',
            };
            throw new Error()
        }
    } catch (err) {
        req.session.userId = '';
        res.clearCookie('token');
        res.redirect('/admin/login?redirect='+ req.originalUrl);
    }
};



