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

        album: [String],

        slug: {
            type: String,
            required: true,
            index: true,
        },

        published: {
            type: String,
            required: true,
            default: 'off',
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        tags: [String],

        category: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
            required: true,
            index: true,
        },

        publishedAt: Date,
    },
    { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text', tags: 'text', description: 'text' });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
