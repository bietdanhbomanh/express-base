const jwt = require('jsonwebtoken');
const userModel = require('../../models/userModel');
const { showLogin } = require('../../utils/show');

module.exports = {
    login: async (req, res) => {
        if (req.session.userId) {
            res.redirect('/admin/dashboard');
        } else {
            if (req.cookies.token) {
                jwt.verify(req.cookies.token, process.env.KEY, async (err, data) => {
                    if (data.ip === req.ip) {
                        res.redirect('/admin/dashboard');
                    }
                });
            } else {
                res.locals.page = {
                    shortTitle: 'Login',
                    title: 'Login CMS ' + process.env.WEB,
                };
                res.render('admin/layout', { main: 'pages/login', method: 'login' });
            }
        }
    },
    loginAjax: async function (req, res) {
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            if (await user.comparePassword(req.body.password)) {
                req.session.userId = user._id.toString();

                if (req.body.remember) {
                    const token = jwt.sign({ userId: req.session.userId, ip: req.ip }, process.env.KEY);
                    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 12 * 3600000) });
                }
                res.json({ status: 'success' });
            } else {
                res.json({ status: 'error', message: 'Sai mật khẩu' });
            }
        } else {
            res.json({ status: 'error', message: 'Tài khoản tồn tại' });
        }
    },

    logout: function (req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Lỗi khi xóa session:', err);
            }
            res.clearCookie('token');

            showLogin(res);
        });
    },
};
