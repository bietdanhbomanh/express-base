const validator = require('validator');

const { mongoose } = require('../../config/db');

const categorySchema = new mongoose.Schema(
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

        type: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: 'category',
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

        position: {
            type: Number,
            default: 0,
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
        },
    },
    { timestamps: true }
);

const categoryModel = mongoose.model('Category', categorySchema);

categoryModel.findOneAndUpdate({ name: 'Uncategorized', slug: 'Uncategorized' }, { upsert: true });

exports = categoryModel;
