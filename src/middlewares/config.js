const menu = require('../../config/menu');
module.exports = {
    loadconfig: (req, res, next) => {
        res.locals.theme = req.cookies.theme ? req.cookies.theme : 'light';
        res.locals.page = {};
        next();
    },
    loadMenu: (req, res, next) => {
        // show hide menu
        menu.forEach((item) => {
            if (req.role.role === 'god') {
                item.show = true;
            } else {
                if (req.role.permissions) {
                    if (Object.keys(req.role.permissions).includes(item.url)) {
                        item.show = true;
                    } else {
                        item.show = false;
                    }
                } else {
                    if (Object.keys(req.role.notPermissions).includes(item.url)) {
                        item.show = false;
                    } else {
                        item.show = true;
                    }
                }
            }
        });

        const url = req.path;

        activeMenu = function (menu) {
            menu.forEach((item) => {
                if (url.startsWith(item.url)) {
                    item.active = true;
                } else {
                    item.active = false;
                }
                if (item.children) activeMenu(item.children);
            });
        };

        activeMenu(menu);

        res.locals.menu = menu;

        next();
    },
};
