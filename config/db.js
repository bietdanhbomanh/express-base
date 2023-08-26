const database = {
    host: 'mongodb://127.0.0.1:27017/web',
};

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(database.host, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = {
    connectDB,
    mongoose,
};
