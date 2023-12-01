const validator = require('validator');

const { mongoose } = require('../../config/db');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
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

        slug: {
            type: String,
            required: true,
            index: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return validator.isSlug(value);
                },
                message: 'slug',
            },
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

const postModel = mongoose.model('Post', postSchema);

exports = postModel;
