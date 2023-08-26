const bcrypt = require('bcrypt');
const validator = require('validator');
const saltRounds = 10;

const { mongoose } = require('../../config/db');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
            trim: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return validator.isEmail(value);
                },
                message: 'email',
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return validator.isStrongPassword(value);
                },
            },
        },

        roleCode: {
            type: Number,
            default: 1,
            required: true,
        },
        type: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (err) {
        next(err);
    }
});

const userModel = mongoose.model('User', userSchema);

async function createOrUpdateUser(data) {
    const user = await userModel.findOne({ username: data.username });

    if (user) {
        const isPasswordValid = await user.comparePassword(data.password);

        if (isPasswordValid) {
            console.log('Đã có user admin');
        } else {
            Object.assign(user, data);
            try {
                await user.save();
                console.log('Cập nhật user admin');
            } catch (e) {
                console.log('Error save');
            }
        }
    } else {
        try {
            await userModel.create(data);
            console.log('Tạo user admin');
        } catch (error) {
            console.log(error.errors);
        }
    }
}

// init create user
createOrUpdateUser({
    username: 'admin',
    password: 'password',
    email: 'admin@admin.com',
    roleCode: 0,
});

module.exports = userModel;
