const { mongoose } = require('../../config/db');

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        metaTitle: {
            type: String,
        },

        description: {
            type: String,
        },
        metaDescription: {
            type: String,
        },

        content: {
            type: String,
        },

        thumbnail: {
            type: String,
        },

        type: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: 'category',
        },
        status: {
            type: String,
            enum: ['on', 'off'],
            default: 'off',
        },

        slug: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        order: {
            type: Number,
            default: 0,
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            default: null,
        },
    },
    { timestamps: true }
);

categorySchema.index({ title: 'text', content: 'text', description: 'text' });

const categoryModel = mongoose.model('Category', categorySchema);

const data = {
    slug: 'uncategorized',
    title: 'Uncategorized',
    description: 'Default category',
    parent: null,
    status: 'on',
};

categoryModel
    .findOneAndUpdate({ slug: 'uncategorized' }, data, { upsert: true })
    .then(() => {
        console.log('Tạo categroy mặc định');
    })
    .catch((error) => {
        console.error('Lỗi category mặc định:', error);
    });

module.exports = categoryModel;
