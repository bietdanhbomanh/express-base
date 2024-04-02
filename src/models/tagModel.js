const { mongoose } = require('../../config/db');

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
    },

    slug: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
});

tagSchema.index({ title: 'text', description: 'text' });

const tagModel = mongoose.model('Tag', tagSchema);

module.exports = tagModel;
