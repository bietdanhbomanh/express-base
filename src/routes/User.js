const express = require('express');
const router = express.Router();

const UserModel = require('../models/User');

router.get('/', (req, res) => {
    UserModel.findAll().then((data) => {
        console.log(
            'Tất cả người dùng:',
            data.map((user) => user.toJSON())
        );
    });
    res.render('admin/layout', { title: 'John', view: 'user/login' });
});

module.exports = router;
