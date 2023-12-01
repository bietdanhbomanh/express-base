const express = require('express');
const { login, logout, loginAjax } = require('../controllers/admin/login');
const { dashboard, menus } = require('../controllers/admin');
const { list, categories, listAjax } = require('../controllers/admin/post');
const authenticate = require('../middlewares/authenticate');
const loadConfig = require('../middlewares/loadConfig');
const loadMenu = require('../middlewares/loadMenu.js');

const { getError404 } = require('../utils/getPage');

const router = express.Router();

const adminMiddlewares = [authenticate, loadMenu, loadConfig];

// Định tuyến cho router
router.get('/admin/login', loadConfig, login);
router.post('/admin/login', loginAjax);
router.get('/admin/logout', logout);

router.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});
router.get('/admin/dashboard', ...adminMiddlewares, dashboard);

router.get('/admin/menus', ...adminMiddlewares, menus);
router.get('/admin/post/categories', ...adminMiddlewares, categories);

router.get('/admin/post/list', ...adminMiddlewares, list);
router.get('/admin/post/listajax', ...adminMiddlewares, listAjax);

router.get('/admin*', loadConfig, (req, res) => {
    getError404(req, res);
});

module.exports = router;
