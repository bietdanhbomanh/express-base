const categoryModel = require('../../models/categoryModel');
const postModel = require('../../models/postModel');
const userModel = require('../../models/userModel');
const tagModel = require('../../models/tagModel');
const { getErrorPage } = require('../../utils/getPage');


const models = {
    category: categoryModel,
    post: postModel,
    tag: tagModel,
    user: userModel,
};

module.exports = async function (req, res) {
    try {
        const viewData = {};
        viewData.action = req.params.action;
        viewData.type = req.params.type;
        viewData.layout = 'admin/layout';
        viewData.data = {};
        viewData.page = {
            shortTitle: viewData.action + ' ' + viewData.type,
            title: viewData.action + ' ' + viewData.type + ' CMS ' + process.env.WEB,
        };

        switch (viewData.action) {
            case 'add':
                // add & copy
                viewData.main = 'postAndCategory/add';
                viewData.ajaxURL = `/admin/${req.params.type}/ajaxadd`;

                switch (viewData.type) {
                    case 'post':
                        viewData.tags = await tagModel.find().sort({ updatedAt: 'desc' });
                        if (req.params.id) {
                            viewData.data = await models[viewData.type].findById(req.params.id);
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
                            viewData.data = await await models[viewData.type].findById(req.params.id);
                            if (viewData.data) {
                                viewData.type = 'copy';
                            } else {
                                throw new Error('Error copy data');
                            }
                        }
                        viewData.categories = await categoryModel.find().sort({ createdAt: 'asc' });
                        break;

                    case 'tag':
                        viewData.main = 'postAndCategory/tag';
                        if (req.params.id) {
                            viewData.data = await await models[viewData.type].findById(req.params.id);
                            if (viewData.data) {
                                viewData.type = 'copy';
                            } else {
                                throw new Error('Error copy data');
                            }
                        }
                        viewData.categories = await categoryModel.find().sort({ createdAt: 'asc' });
                        break;
                    case 'user':
                        viewData.main = 'user/add';
                        if (req.params.id) {
                            viewData.data = await await models[viewData.type].findById(req.params.id);
                            if (viewData.data) {
                                viewData.type = 'copy';
                                if (res.locals.user.roleCode >= viewData.data.roleCode && res.locals.user._id.toString() != viewData.data._id.toString()) {
                                    throw new Error('Not permission edit');
                                }
                            } else {
                                throw new Error('Error copy data');
                            }
                        }
                        viewData.categories = await categoryModel.find().sort({ createdAt: 'asc' });
                        break;
                }
                break;

            case 'edit':
                viewData.ajaxURL = `/admin/${req.params.type}/ajaxedit`;
                viewData.main = 'postAndCategory/add';

                if (req.params.id) {
                    switch (viewData.type) {
                        case 'post':
                            viewData.data = await models[viewData.type].findById(req.params.id);

                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            viewData.users = await userModel.find().sort({ updatedAt: 'desc' });
                            viewData.tags = await tagModel.find().sort({ updatedAt: 'desc' });
                            viewData.author = res.locals.user;
                            viewData.categories = await categoryModel.find().sort({ updatedAt: 'desc' });
                            break;
                        case 'category':
                            viewData.data = await models[viewData.type].findById(req.params.id);
                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            viewData.categories = await models[viewData.type].find().sort({ createdAt: 'asc' });
                            break;
                        case 'tag':
                            viewData.data = await models[viewData.type].findById(req.params.id);
                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            viewData.main = 'postAndCategory/tag';
                            break;

                        case 'user':
                            viewData.data = await models[viewData.type].findById(req.params.id);
                            if (!viewData.data) {
                                throw new Error('Error edit data');
                            }
                            if (res.locals.user.roleCode >= viewData.data.roleCode && res.locals.user._id.toString() != viewData.data._id.toString()) {
                                throw new Error('Not permission edit');
                            }
                            viewData.main = 'user/add';
                            break;
                    }
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
