const config = require('./config');
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectModule: mysql2,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Kết nối thành công đến cơ sở dữ liệu.');

        // Tạo bảng nếu chưa tồn tại
        return sequelize.sync();
    })

    .catch((err) => {
        console.error('Kết nối database thất bại:', err);
    });

module.exports = sequelize;
