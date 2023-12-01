const groupMethod = {};
module.exports = {
    0: { role: 'god' },

    1: {
        role: 'admin',
    },

    2: {
        role: 'mod',
        permissions: {
            '/admin/dashboard': ['GET'],
            '/admin/menus': ['GET'],
        },
    },

    3: {
        role: 'author',
        permissions: {
            '/admin/post': ['ALL'],
        },
    },
};
