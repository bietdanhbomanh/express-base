const express = require('express');
const { login, logout, loginAjax } = require('../controllers/admin/login');
const { dashboard, post, menus } = require('../controllers/admin');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { loadMenu, loadconfig } = require('../middlewares/config');
const { showError404 } = require('../utils/show');

const router = express.Router();

const adminMiddlewares = [authenticate, authorize, loadMenu, loadconfig];

// Định tuyến cho router
router.get('/admin/login', loadconfig, login);
router.post('/admin/login', loginAjax);

router.get('/admin/logout', logout);

router.get('/admin', ...adminMiddlewares, dashboard);
router.get('/admin/dashboard', ...adminMiddlewares, dashboard);

router.get('/admin/post', ...adminMiddlewares, post);
router.get('/admin/menus', ...adminMiddlewares, menus);
router.get('/admin/post/categories', ...adminMiddlewares, post);

router.get('/admin/post/*', ...adminMiddlewares, post);

router.get('/admin*', loadconfig, (req, res) => {
    showError404(req, res);
});

module.exports = router;
