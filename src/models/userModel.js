const bcrypt = require('bcrypt');
const validator = require('validator');

const { mongoose } = require('../../config/db');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 6,
            maxlength: 20,
            validate: {
                validator: function (value) {
                    const regex = /^[a-zA-Z0-9-_]+$/; // Chỉ chấp nhận ký tự chữ, số và dấu gạch dưới
                    return regex.test(value);
                },
                message: 'invalid username',
            },
        },

        displayName: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 32,
            trim: true,
        },

        description: {
            type: String,
            default: '',
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return validator.isEmail(value);
                },
                message: 'invalid email',
            },
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        dateOfBirth: {
            type: Date,
        },

        status: {
            type: String,
            enum: ['on', 'off'],
            default: 'off',
        },

        password: {
            type: String,
        },
        avatar: {
            type: String,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        roleCode: {
            type: Number,
            default: 4,
        },
        type: {
            type: String,
            enum: ['user', 'cms'],
            default: 'cms',
        },
    },
    { timestamps: true }
);

userSchema.index({ username: 'text', displayName: 'text' });

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const saltRounds = 10;
userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (err) {
        next(err);
    }
});

const userModel = mongoose.model('User', userSchema);

const defaultUser = new userModel({
    username: 'phamtai',
    password: '@Tytyty123',
    email: 'admin@admin.com',
    displayName: 'Administrator',
    roleCode: 0,
    status: 'on',
});
defaultUser
    .save()
    .then((e) => {
        console.log('Tạo user default');
    })
    .catch((e) => {
        console.error('User default có sẵn hoặc lỗi');
    });

module.exports = userModel;
