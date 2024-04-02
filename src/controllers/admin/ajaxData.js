const categoryModel = require('../../models/categoryModel');
const postModel = require('../../models/postModel');
const tagModel = require('../../models/tagModel');
const moment = require('moment');

module.exports = {
    list: async function (req, res) {
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

        try {
            switch (req.params.type) {
                case 'post': {
                    const list = await postModel
                        .find(filter)
                        .populate('category')
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');
                        if (!item.category) {
                            return {
                                ...item.toObject(),
                                updatedAt: formattedDate,
                                category: { title: 'Uncategorized' },
                            };
                        } else {
                            return { ...item.toObject(), updatedAt: formattedDate };
                        }
                    });

                    const total = await postModel.countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });

                    break;
                }

                case 'category': {
                    const list = await categoryModel
                        .find(filter)
                        .populate('parent')
                        .limit(size)
                        .skip((page - 1) * size)
                        .sort(sort);

                    const formattedList = list.map((item) => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');

                        return { ...item.toObject(), updatedAt: formattedDate };
                    });

                    const total = await categoryModel.countDocuments(filter);

                    res.json({ data: formattedList, total, last_page: Math.ceil(total / size) });

                    break;
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    },
    add: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'category': {
                    const tagIds = [];
                    if (req.body.tags && req.body.tags.length > 0) {
                        for (const tag of req.body.tags) {
                            // Tìm kiếm tag trong database
                            const slug = res.locals.helpers.toSlug(tag);
                            const existingTag = await tagModel.findOne({ slug });

                            if (existingTag) {
                                // Thêm id tag vào mảng tagIds
                                tagIds.push(existingTag.title);
                            } else {
                                // Tạo tag mới
                                const newTag = await tagModel.create({ title: tag, slug });
                                // Thêm id tag mới vào mảng tagIds
                                tagIds.push(newTag.title);
                            }
                        }
                    }
                    req.body.tags = tagIds;

                    const data = new categoryModel(req.body);
                    await data.save();
                    res.json({ status: 1, message: 'Tạo category thành công', delay: 2000 });
                    break;
                }

                case 'post': {
                    const tagIds = [];
                    if (req.body.tags && req.body.tags.length > 0) {
                        for (const tag of req.body.tags) {
                            // Tìm kiếm tag trong database
                            const slug = res.locals.helpers.toSlug(tag);
                            const existingTag = await tagModel.findOne({ slug });

                            if (existingTag) {
                                // Thêm id tag vào mảng tagIds
                                tagIds.push(existingTag.title);
                            } else {
                                // Tạo tag mới
                                const newTag = await tagModel.create({ title: tag, slug });
                                // Thêm id tag mới vào mảng tagIds
                                tagIds.push(newTag.title);
                            }
                        }
                    }
                    req.body.tags = tagIds;

                    await postModel.create(req.body);

                    console.log(req.body);

                    res.json({ status: 1, message: 'Tạo bài viết mới thành công', delay: 2000 });
                    break;
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    },

    edit: async function (req, res) {
        if (!req.body.published) {
            req.body = { ...req.body, published: 'off' };
        }
        try {
            switch (req.params.type) {
                case 'post': {
                    const data = await postModel.findByIdAndUpdate(req.body._id, req.body);
                    if (data) {
                        res.json({ status: 1, message: 'Sửa bài viết thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }

                case 'category': {
                    const data = await categoryModel.findByIdAndUpdate(req.body._id, req.body);
                    if (data) {
                        res.json({ status: 1, message: 'Sửa bài viết thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }

                default:
                    res.json({ status: 0, message: 'Lỗi xảy ra khi thực hiện, kiểm tra lại' });
            }
        } catch (err) {
            res.json({ status: 0, message: err.message });
        }
    },

    delete: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'post': {
                    const data = await postModel.findByIdAndDelete(req.body._id);
                    if (data) {
                        res.json({ status: 1, message: 'Xóa bài viết thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }

                case 'category': {
                    const upload = await categoryModel.findByIdAndDelete(req.body._id);
                    if (upload) {
                        res.json({ status: 1, message: 'Xóa category thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }
            }
        } catch (err) {
            res.json({ status: 0, message: err.message });
        }
    },

    multiDelete: async function (req, res) {
        try {
            switch (req.params.type) {
                case 'post': {
                    const data = await postModel.deleteMany({ _id: { $in: req.body._ids } });
                    if (data) {
                        res.json({ status: 1, message: 'Xóa bài viết thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }

                case 'category': {
                    const data = await categoryModel.deleteMany({ _id: { $in: req.body._ids } });

                    if (data) {
                        res.json({ status: 1, message: 'Xóa category thành công', delay: 2000 });
                    } else {
                        throw new Error('Lỗi khi thao tác');
                    }
                    break;
                }
            }
        } catch (err) {
            res.json({ status: 0, message: err.message });
        }
    },
};
