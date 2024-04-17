const categoryModel = require('../../models/categoryModel');
const postModel = require('../../models/postModel');
const tagModel = require('../../models/tagModel');
const userModel = require('../../models/userModel');
const { jsonErrorForm } = require('../../utils/getJson');
const moment = require('moment');

const models = {
    category: categoryModel,
    post: postModel,
    tag: tagModel,
    user: userModel,
};

module.exports = {
    list: async function (req, res) {
        try {
            let filter = {};
            if (req.body.filter.length > 0) {
                const { value } = req.body.filter[0];
                if (value) {
                    filter = { $text: { $search: value } };
                }
            }

            let sort = { updatedAt: 'desc' };

            if (req.body.sort.length > 0) {
                const { field, dir } = req.body.sort[0];
                sort = { [field]: [dir] };
            }

            const page = req.body.page || 1;
            const size = req.body.size || 5;
            switch (req.params.type) {
                case 'post': {
                    const list = await models[req.params.type]
                        .find(filter)
                        .populate('categories')
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');
                        return { ...item.toObject(), updatedAt: formattedDate };
                    });

                    const total = await models[req.params.type].countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });

                    break;
                }

                case 'category': {
                    const list = await models[req.params.type]
                        .find(filter)
                        .populate('parent')
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');

                        return { ...item.toObject(), updatedAt: formattedDate };
                    });

                    const total = await models[req.params.type].countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });

                    break;
                }

                case 'tag': {
                    const list = await models[req.params.type]
                        .find(filter)
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');

                        return { ...item.toObject(), updatedAt: formattedDate };
                    });

                    const total = await models[req.params.type].countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });
                    break;
                }
                case 'user': {
                    filter.roleCode = { $gt: res.locals.user.roleCode };
                    const list = await models[req.params.type]
                        .find(filter)
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const updatedAt = moment(item.updatedAt).format('YYYY-MM-DD');
                        const role = res.locals.roles[item.roleCode];

                        return { ...item.toObject(), updatedAt, role };
                    });

                    const total = await models[req.params.type].countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });
                    break;
                }
            }
        } catch (err) {
            res.json({ status: 0, message: err.message });
        }
    },
    add: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'user':
                    if (res.locals.user.roleCode < req.body.roleCode) {
                        const data = new models[req.params.type](req.body);
                        await data.save();
                        res.json({
                            status: 1,
                            message: 'Tạo ' + req.params.type + ' thành công',
                            delay: 2000,
                            data,
                            reload: true,
                        });
                    } else {
                        throw new Error('Not permission role');
                    }
                    break;
                default:
                    const data = new models[req.params.type](req.body);
                    await data.save();
                    res.json({
                        status: 1,
                        message: 'Tạo ' + req.params.type + ' thành công',
                        delay: 2000,
                        data,
                        reload: true,
                    });
                    break;
            }
        } catch (err) {
            jsonErrorForm({ res, err });
        }
    },

    edit: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'user':
                    const user = await models[req.params.type].findById(req.body._id);
                    if (!user) {
                        throw new Error('User not exist');
                    }
                    if (res.locals.user.roleCode < user.roleCode) {
                        Object.assign(user, req.body);
                    } else if (res.locals.user.roleCode == user.roleCode) {
                        if (res.locals.user._id.toString() === user._id.toString()) {
                            delete req.body.roleCode;
                            delete req.body.status;
                            if (req.body.oldPassword === req.body.password) {
                                throw new Error('Password not change');
                            }
                            if (!(await user.comparePassword(req.body.oldPassword))) {
                                throw new Error('Authen password error');
                            }
                            if (req.body.roleCode < res.locals.user.roleCode) {
                                throw new Error('Role not permission');
                            }
                            Object.assign(user, req.body);
                        } else {
                            throw new Error('Not permission');
                        }
                    } else {
                        throw new Error('Not permission');
                    }

                    {
                        const data = await user.save();
                        res.json({
                            status: 1,
                            message: 'Edit ' + req.params.type + ' thành công',
                            data,
                            reload: true,
                            delay: 2000,
                        });
                    }
                    break;
                default:
                    const data = await models[req.params.type].findByIdAndUpdate(req.body._id, req.body);
                    if (data) {
                        res.json({
                            status: 1,
                            message: 'Edit ' + req.params.type + ' thành công',
                            data,
                        });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
            }
        } catch (err) {
            jsonErrorForm({ res, err });
        }
    },

    delete: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'user':
                    {
                        const data = await models[req.params.type].deleteMany({
                            $and: [{ _id: { $in: req.body._ids } }, { roleCode: { $gt: res.locals.user.roleCode } }],
                        });
                        if (data.deletedCount > 0) {
                            res.json({ status: 1, message: 'Xóa ' + req.params.type + ' thành công' });
                        } else {
                            throw new Error('Lỗi khi thao tác');
                        }
                    }
                    break;
                default:
                    const data = await models[req.params.type].deleteMany({ _id: { $in: req.body._ids } });
                    if (data.deletedCount > 0) {
                        res.json({ status: 1, message: 'Xóa ' + req.params.type + ' thành công' });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
            }
        } catch (err) {
            res.json({ status: 0, message: err.message });
        }
    },
};
