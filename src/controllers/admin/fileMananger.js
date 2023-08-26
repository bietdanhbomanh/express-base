module.exports = {
    fileManager: function (req, res) {
        res.locals.page = {
            shortTitle: 'File Manager',
            title: 'File Manager CMS ' + process.env.WEB,
        };
        res.render('admin/layout', { main: 'pages/filemanager' });
    },
};
