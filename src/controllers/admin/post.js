const categoryModel = require('../../models/categoryModel');
const postModel = require('../../models/postModel');

module.exports = {
    add: function (req, res) {
        switch (req.method) {
            case 'POST':
                console.log(req.body);
                break;

            default:
                res.locals.page = {
                    shortTitle: 'Add New',
                    title: 'Add New CMS ' + process.env.WEB,
                };
                res.render('admin/layout', { main: 'post/add' });
        }
    },
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
