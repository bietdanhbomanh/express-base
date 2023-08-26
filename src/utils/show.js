module.exports = {
    showLogin: function (res) {
        res.redirect('/admin/login');
    },

    showError404: function (req, res) {
        res.locals.themeCms = req.cookies.themeCms ? req.cookies.themeCms : 'light';
        res.status(404).render('admin/layout', { main: 'pages/404' });
    },
};
