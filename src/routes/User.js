const express = require('express');
const router = express.Router();

const userController = require('../controllers/User.js');

router
    .get('/', userController.login)
    .post('/getAllUsers', userController.getAllUser)
    .patch('/update', userController.updateUser);

module.exports = router;
