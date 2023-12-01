const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (req.session.userId) {
        // Xác thực session và lấy thông tin user
        const user = await userModel.findById(req.session.userId);
        req.user = user;
        next();
    } else {
        // Hoặc xác thực bằng cookies và lấy thông tin user: trường hợp remember
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, process.env.KEY, async (err, data) => {
                // Kiểm tra ip đảm bảo không bị copy token
                if (data.ip === req.ip) {
                    req.session.userId = data.userId;
                    const user = await userModel.findById(req.session.userId);
                    req.user = user;
                    next();
                }
            });
        } else {
            // Chặn và bắt đăng nhập lại
            res.redirect('/admin/login');
        }
    }
};
