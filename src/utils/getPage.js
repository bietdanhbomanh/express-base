module.exports = {
    getErrorPage: function ({ req, res, code, message }) {
        const data = {
            code: code || 404,
            message: message || 'You may have mistyped the address or the page may have moved.',
            page: {
                shortTitle: 'Error not found',
                title: 'Error not found CMS ' + process.env.WEB,
            },
            layout: 'admin/layout',
            main: 'pages/Error',
        };

        Object.assign(res.locals, data);

        res.status(data.code).render(data.layout, data);
    },

    getRefresh: function (req, res) {
        const currentUrl = req.originalUrl;

        res.redirect(currentUrl);
    },
};
