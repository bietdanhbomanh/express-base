module.exports = {
    getError404: function (req, res) {
        res.locals.page = {
            shortTitle: 'Error not found',
            title: 'Error not found CMS ' + process.env.WEB,
        };
        res.locals.theme = req.cookies.theme ? req.cookies.theme : 'light';
        res.status(404).render('admin/layout', { main: 'pages/404' });
    },

    getRefresh: function (req, res) {
        const currentUrl = req.originalUrl;

        res.redirect(currentUrl);
    },
};
