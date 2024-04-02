const categoryModel = require('../../models/categoryModel');
const postModel = require('../../models/postModel');
const userModel = require('../../models/userModel');
const tagModel = require('../../models/tagModel');
const { getErrorPage } = require('../../utils/getPage');

module.exports = async function (req, res) {
    try {
        const viewData = {};
        viewData.action = req.params.action;
        viewData.type = req.params.type;
        viewData.layout = 'admin/layout';

        switch (viewData.action) {
            case 'add':
                switch (viewData.type) {
                    case 'post':
                        if (req.params.id) {
                            viewData.data = await postModel.findById(req.params.id);
                            if (viewData.data) {
                                viewData.action = 'copy';
                            } else {
                                throw new Error('Error copy data');
                            }
                        }
                        viewData.author = res.locals.user;

                        viewData.users = await userModel.find().sort({ updatedAt: 'desc' });
                        viewData.categories = await categoryModel.find().sort({ updatedAt: 'desc' });
                        break;
                    case 'category':
                        if (req.params.id) {
                            viewData.data = await categoryModel.findById(req.params.id);
                            if (viewData.data) {
                                viewData.type = 'copy';
                            } else {
                                throw new Error('Error copy data');
                            }
                        }
                        viewData.categories = await categoryModel.find().sort({ createdAt: 'asc' });
                        break;
                }

                viewData.ajaxURL = `/admin/${req.params.type}/ajaxadd`;
                viewData.tags = await tagModel.find().sort({ updatedAt: 'desc' });
                viewData.page = {
                    shortTitle: 'Add New' + viewData.type,
                    title: 'Add New CMS ' + process.env.WEB,
                };
                viewData.main = 'pages/addForm';

                break;

            case 'edit':
                if (req.params.id) {
                    switch (viewData.type) {
                        case 'post':
                            viewData.data = await postModel.findById(req.params.id);
                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            viewData.author = res.locals.user;

                            viewData.users = await userModel.find().sort({ updatedAt: 'desc' });
                            viewData.categories = await categoryModel.find().sort({ updatedAt: 'desc' });
                            break;
                        case 'category':
                            viewData.data = await categoryModel.findById(req.params.id);
                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            viewData.categories = await categoryModel.find().sort({ createdAt: 'asc' });
                            break;
                    }

                    viewData.tags = await tagModel.find().sort({ updatedAt: 'desc' });
                    viewData.page = {
                        shortTitle: 'Add New' + viewData.type,
                        title: 'Add New CMS ' + process.env.WEB,
                    };
                    viewData.main = 'pages/addForm';
                    viewData.ajaxURL = `/admin/${req.params.type}/ajaxedit`;
                } else {
                    throw new Error('Lỗi edit data');
                }

                break;

            case 'list':
                viewData.page = {
                    shortTitle: 'List ' + req.params.type,
                    title: 'List Post CMS ' + process.env.WEB,
                };
                viewData.main = 'pages/listData';
                viewData.ajaxURL = `/admin/${req.params.type}/ajaxlist`;
                break;
        }

        Object.assign(res.locals, viewData);
        res.render(viewData.layout, viewData);
    } catch (e) {
        getErrorPage({ req, res, message: e.message });
    }
};
