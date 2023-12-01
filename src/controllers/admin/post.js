const categoryModel = require('../../models/categoryModel');

module.exports = {
    list: function (req, res) {
        res.locals.page = {
            shortTitle: 'List Post',
            title: 'List Post CMS ' + process.env.WEB,
        };
        res.render('admin/layout', { main: 'post/list' });
    },

    listAjax: function (req, res) {
        if (req.query.filter) {
            const { fieldFilter, type, value } = req.query.filter[0];
        }

        if (req.query.sort) {
            const { fieldSort, dir } = req.query.sort[0];
        }
        const page = req.query.page;
        const size = req.query.size;

        res.json(req.query);
    },

    categories: function (req, res) {
        res.locals.page = {
            shortTitle: 'Categories Post',
            title: 'Categories Post CMS ' + process.env.WEB,
        };
        res.render('admin/layout', { main: 'post/categories' });
    },
};
