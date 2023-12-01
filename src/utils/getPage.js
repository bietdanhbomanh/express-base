module.exports = {
    getError404: function (req, res) {
        res.locals.theme = req.cookies.theme ? req.cookies.theme : 'light';
        res.status(404).render('admin/layout', { main: 'pages/404' });
    },
};
