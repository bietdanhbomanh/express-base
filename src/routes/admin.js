const express = require('express');

const { login, logout, loginAjax } = require('../controllers/admin/login');
const dashboard = require('../controllers/admin/dashboard');
const menu = require('../controllers/admin/menu');
const getPageData = require('../controllers/admin/getPageData');
const ajaxData = require('../controllers/admin/ajaxData');
const fileManager = require('../controllers/admin/fileManager');
const authenticate = require('../middlewares/authenticate');
const loadMenuAdmin = require('../middlewares/loadMenuAdmin');
const preHandleSubmit = require('../middlewares/preHandleSubmit');
const loadHelpers = require('../utils/helpers');


const { getErrorPage } = require('../utils/getPage');

const router = express.Router();

const adminMiddlewares = [authenticate, loadMenuAdmin, loadHelpers];

// Định tuyến cho router
router.get('/admin/login', login);
router.post('/admin/login', loginAjax);
router.get('/admin/logout', logout);

router.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});

router.get('/admin/dashboard', ...adminMiddlewares, dashboard);

router.get('/admin/menus', ...adminMiddlewares, menu);

router.all('/admin/file-manager*', ...adminMiddlewares, fileManager);

router.get('/admin/:type(category|post|tag|user|setting)/:action(add|list|edit)(/:id)?', ...adminMiddlewares, getPageData);

router.get('/admin/:type(category|post|tag|user|setting)', (req, res) => {
    res.redirect(`/admin/${req.params.type}/list`);
});

router.post('/admin/:type/ajaxlist', ...adminMiddlewares, ajaxData.list);
router.put('/admin/:type/ajaxadd', ...adminMiddlewares, preHandleSubmit, ajaxData.add);
router.patch('/admin/:type/ajaxedit', ...adminMiddlewares, preHandleSubmit,ajaxData.edit);
router.delete('/admin/:type/ajaxdelete', ...adminMiddlewares, ajaxData.delete);

router.get('*', (req, res) => {
    getErrorPage(req, res);
});

module.exports = router;
