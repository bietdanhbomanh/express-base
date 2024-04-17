const tagModel = require('../models/tagModel');
const { jsonErrorForm } = require('../utils/getJson');

module.exports = async function (req, res, next) {
    try {
        if (!req.body.status) {
            req.body = { ...req.body, status: 'off' };
        }
        if (req.body.tags && req.body.tags.length > 0) {
            const tagIds = [];
            for (const tag of req.body.tags) {
                // Tìm kiếm tag trong database
                const slug = res.locals.urlHelper.toSlug(tag);
                const existingTag = await tagModel.findOne({ slug });
                if (existingTag) {
                    // Thêm id tag vào mảng tagIds
                    tagIds.push(existingTag._id);
                } else {
                    // Tạo tag mới
                    const newTag = await tagModel.create({ title: tag, slug });
                    // Thêm id tag mới vào mảng tagIds
                    tagIds.push(newTag._id);
                }
            }
            req.body.tags = tagIds;
        } else {
            req.body.tags = [];
        }
    
        if (!req.body.categories) {
            req.body.categories = [];
        } 
    
        if (!req.body.album) {
            req.body.album = [];
        } 

        if (!req.body.thumbnail) {
            req.body.thumbnail = '/images/noimg.png';
        } 
        if (!req.body.avatar) {
            req.body.avatar = '/images/noimg.png';
        } 
    
        next();
        
    } catch (err) {
        jsonErrorForm({res, message: err.message})   
    }
}