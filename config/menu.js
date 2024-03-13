module.exports = [
    {
        icon: 'home',
        name: 'Dashboard',
        url: '/admin/dashboard',
        children: [],
        devider: true,
        hidden: false,
    },

    {
        icon: 'box',
        name: 'Menu',
        url: '/admin/menus',
        children: [],
    },

    {
        icon: 'hard-drive',
        name: 'File Manager',
        url: '/admin/file-manager',
        children: [],
    },
    {
        icon: 'file-text',
        name: 'Post',
        url: '/admin/post',
        javascript: 'javascript:;',
        children: [
            {
                icon: 'plus',
                name: 'Add new',
                url: '/admin/post/add',
                children: [],
            },
            {
                icon: 'default',
                name: 'List',
                url: '/admin/post/list',
                children: [],
            },

            {
                icon: 'default',
                name: 'Categories',
                url: '/admin/post/categories',
                children: [],
            },
        ],
    },
];
