const { mongoose } = require('../../config/db');

const optionSchema = new mongoose.Schema({
    field: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    json: {
        type: Object,
    },
});

const OptionModel = mongoose.model('Option', optionSchema);

OptionModel.create({ field: 'settings 1', json: { website: 'Tailatin' } })
    .then()
    .catch((err) => {});

OptionModel.updateOne({ field: 'settings 1' }, { json: { website: 'Tailatin2ff' } }, { versionKey: true })
    .then()
    .catch((err) => {});

module.exports = OptionModel;
