const { mongoose } = require('../../config/db');

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
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

        tags: {
            type: [String],
        },

        type: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: 'category',
        },
        published: {
            type: String,
            required: true,
            default: 'off',
        },

        slug: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },

        position: {
            type: Number,
            default: 0,
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
        },

        published: {
            type: String,
            default: 'off',
        },
    },
    { timestamps: true }
);

categorySchema.index({ title: 'text', content: 'text', tags: 'text', description: 'text' });

const categoryModel = mongoose.model('Category', categorySchema);

const data = {
    slug: 'uncategorized',
    title: 'Uncategorized',
    description: 'Default category',
    parent: null,
    published: 'on',
};

categoryModel
    .findOneAndUpdate({ description: 'Default category' }, data, { upsert: true })
    .then(() => {
        console.log('Category mặc định');
    })
    .catch((error) => {
        console.error('Lỗi category mặc định:', error);
    });

module.exports = categoryModel;
