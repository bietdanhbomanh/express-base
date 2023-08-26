const groupMethod = {};
module.exports = {
    0: { role: 'god' },

    1: {
        role: 'admin',
        notPermissions: {
            '/admin/dashboard': ['GET'],
            '/admin/menus': ['GET'],
        },
    },

    2: {
        role: 'mod',
        permissions: {},
    },

    3: {
        role: 'author',
        permissions: {
            '/admin/post': ['ALL'],
        },
    },
};
