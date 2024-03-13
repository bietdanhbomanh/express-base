const jwt = require('jsonwebtoken');
// const userModel = require('../../models/userModel');
const userModel = require('../../models/userModel');

module.exports = {
    login: async (req, res) => {
        if (req.session.userId || req.cookies.token) {
            // Trường hợp đã đăng nhập
            res.redirect('/admin/dashboard');
        } else {
            // Trường hợp chưa đăng nhập
            res.locals.page = {
                shortTitle: 'Login',
                title: 'Login CMS ' + process.env.WEB,
            };
            res.render('admin/layout', { main: 'pages/login', mainClass: 'login' });
        }
    },
    loginAjax: async function (req, res) {
        console.log(req.body);
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            // Xác thực password
            if (await user.comparePassword(req.body.password)) {
                req.session.userId = user._id.toString();

                if (req.body.remember) {
                    // Trường hợp chọn remember, lưu jwt biến token vào cookie
                    const token = jwt.sign({ userId: req.session.userId, ip: req.ip }, process.env.KEY);
                    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 2 * 3600000) });
                }
                res.json({ status: 1 });
            } else {
                res.json({
                    status: 0,
                    message: 'Lỗi xác thực',
                    form: { password: 'Mật khẩu không chính xác' },
                });
            }
        } else {
            res.json({ status: 0, message: 'Lỗi xác thực', form: { username: 'Tài khoản không tồn tại' } });
        }
    },

    logout: function (req, res) {
        // Xóa đăng nhập bằng cách xóa cả session lẫn biến token trong cookies
        req.session.destroy((err) => {
            res.clearCookie('token');
            res.redirect('/admin/login');
        });
    },
};
