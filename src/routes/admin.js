const express = require('express');
const { login, logout, loginAjax } = require('../controllers/admin/login');
const dashboard = require('../controllers/admin/dashboard.js');
const menu = require('../controllers/admin/menu.js');
const { add, list, categories, listAjax } = require('../controllers/admin/post');
const fileManager = require('../controllers/admin/fileMananger.js');
const authenticate = require('../middlewares/authenticate');
const loadConfig = require('../middlewares/loadConfig');
const loadMenu = require('../middlewares/loadMenu.js');
const loadHelpers = require('../utils/helpers');

const { getError404 } = require('../utils/getPage');

const router = express.Router();

const adminMiddlewares = [authenticate, loadMenu, loadConfig, loadHelpers];

// Định tuyến cho router
router.get('/admin/login', loadConfig, login);
router.post('/admin/login', loginAjax);
router.get('/admin/logout', logout);

router.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});

router.get('/admin/dashboard', ...adminMiddlewares, dashboard);
router.get('/admin/menus', ...adminMiddlewares, menu);

router.get('/admin/post/categories', ...adminMiddlewares, categories);

router.all('/admin/file-manager*', ...adminMiddlewares, fileManager);

router.all('/admin/post/add', ...adminMiddlewares, add);

router.get('/admin/post/list', ...adminMiddlewares, list);
router.get('/admin/post/listajax', ...adminMiddlewares, listAjax);

router.get('*', loadConfig, (req, res) => {
    getError404(req, res);
});

module.exports = router;
