const UserModel = require('../models/User');

const controller = {
    login: function (req, res, next) {
        res.render('admin/layout', { title: 'John', view: 'user/login' });
    },
    getAllUser: function (req, res, next) {
        UserModel.findAll().then((data) => {
            console.log(
                'Tất cả người dùng:',
                data.map((user) => user.toJSON())
            );
        });
    },
    updateUser: function (req, res, next) {
        res.json('update');
    },
};

module.exports = controller;
