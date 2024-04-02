const express = require('express');
const { login, logout, loginAjax } = require('../controllers/admin/login');
const dashboard = require('../controllers/admin/dashboard.js');
const menu = require('../controllers/admin/menu.js');
const dataHandle = require('../controllers/admin/data');
const ajaxData = require('../controllers/admin/ajaxData');
const fileManager = require('../controllers/admin/fileManager.js');
const authenticate = require('../middlewares/authenticate');
const loadConfig = require('../middlewares/loadConfig');
const loadMenu = require('../middlewares/loadMenu.js');
const loadHelpers = require('../utils/helpers');

const { getErrorPage } = require('../utils/getPage');

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

router.all('/admin/file-manager*', ...adminMiddlewares, fileManager);

router.get('/admin/:type(category|post)/:action(add|list|edit)(/:id)?', ...adminMiddlewares, dataHandle);

router.post('/admin/:type/ajaxlist', ...adminMiddlewares, ajaxData.list);
router.put('/admin/:type/ajaxadd', ...adminMiddlewares, ajaxData.add);
router.patch('/admin/:type/ajaxedit', ...adminMiddlewares, ajaxData.edit);
router.delete('/admin/:type/ajaxdelete', ...adminMiddlewares, ajaxData.delete);
router.delete('/admin/:type/ajaxmultidelete', ...adminMiddlewares, ajaxData.multiDelete);

router.get('*', loadConfig, (req, res) => {
    getErrorPage(req, res);
});

module.exports = router;
