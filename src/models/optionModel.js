const { mongoose } = require('../../config/db');

const optionSchema = new mongoose.Schema({
    field: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    data: {
        type: Object,
    },
});

const OptionModel = mongoose.model('Option', optionSchema);

module.exports = OptionModel;
