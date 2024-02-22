module.exports = (req, res) => {
    res.locals.page = {
        shortTitle: 'Dashboard',
        title: 'Dashboard CMS ' + process.env.WEB,
    };
    res.render('admin/layout', { main: 'pages/dashboard' });
};
