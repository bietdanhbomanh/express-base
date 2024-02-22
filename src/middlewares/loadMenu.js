// module.exports = (req, res, next) => {
//     const menu = require('../../config/menu');
//     // show hide menu
//     menu.forEach((item) => {
//         if (req.role.role === 'god') {
//             item.show = true;
//         } else {
//             if (req.role.permissions) {
//                 if (Object.keys(req.role.permissions).includes(item.url)) {
//                     item.show = true;
//                 } else {
//                     item.show = false;
//                 }
//             } else {
//                 if (Object.keys(req.role.notPermissions).includes(item.url)) {
//                     item.show = false;
//                 } else {
//                     item.show = true;
//                 }
//             }
//         }
//     });

const { menus } = require('../controllers/admin/dashboard');

//     const url = req.path;

//     activeMenu = function (menu) {
//         menu.forEach((item) => {
//             if (url.startsWith(item.url)) {
//                 item.active = true;
//             } else {
//                 item.active = false;
//             }
//             if (item.children) activeMenu(item.children);
//         });
//     };

//     activeMenu(menu);

//     res.locals.menu = menu;

//     next();
// };

module.exports = (req, res, next) => {
    const menu = require('../../config/menu');
    // // show hide menu
    // menu.forEach((item) => {
    //     if (req.role.role === 'god') {
    //         item.show = true;
    //     } else {
    //         if (req.role.permissions) {
    //             if (Object.keys(req.role.permissions).includes(item.url)) {
    //                 item.show = true;
    //             } else {
    //                 item.show = false;
    //             }
    //         } else {
    //             if (Object.keys(req.role.notPermissions).includes(item.url)) {
    //                 item.show = false;
    //             } else {
    //                 item.show = true;
    //             }
    //         }
    //     }
    // });

    // const url = req.path;

    // activeMenu = function (menu) {
    //     menu.forEach((item) => {
    //         if (url.startsWith(item.url)) {
    //             item.active = true;
    //         } else {
    //             item.active = false;
    //         }
    //         if (item.children) activeMenu(item.children);
    //     });
    // };

    // activeMenu(menu);

    res.locals.menu = menu;

    next();
};
