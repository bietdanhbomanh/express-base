module.exports = {
    dashboard: function (req, res) {
        res.locals.page = {
            shortTitle: 'Dashboard',
            title: 'Dashboard CMS ' + process.env.WEB,
        };
        res.render('admin/layout', { main: 'pages/dashboard' });
    },
    post: function (req, res) {
        res.render('admin/layout', { main: 'pages/dashboard' });
    },
    menus: function (req, res) {
        res.render('admin/layout', { main: 'pages/dashboard' });
    },
};
