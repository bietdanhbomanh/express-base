const { mongoose } = require('../../config/db');

const postSchema = new mongoose.Schema(
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

        album: {
            type: [String],
            default: [],
        },

        slug: {
            type: String,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ['on', 'off'],
            default: 'off',
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
            default: null,
        },

        order: {
            type: Number,
            default: 0,
        },

        tags: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
            default: [],
        },

        categories: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
            index: true,
            default: [],
        },

        publishedAt: Date,
    },
    { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text', description: 'text' });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
