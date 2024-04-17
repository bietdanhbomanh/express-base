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
        icon: 'user',
        name: 'User',
        javascript: 'javascript:;',
        url: '/admin/user',

        children: [
            {
                icon: 'plus',
                name: 'Add new',
                url: '/admin/user/add',
                children: [],
            },
            {
                icon: 'default',
                name: 'List',
                url: '/admin/user/list',
                children: [],
            },
        ],
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
        icon: 'book-minus',
        name: 'Category',
        javascript: 'javascript:;',
        url: '/admin/category',

        children: [
            {
                icon: 'plus',
                name: 'Add new',
                url: '/admin/category/add',
                children: [],
            },
            {
                icon: 'default',
                name: 'List',
                url: '/admin/category/list',
                children: [],
            },
        ],
    },
    {
        icon: 'file-text',
        name: 'Post',
        url: '/admin/categories',
        javascript: 'javascript:;',
        url: '/admin/post',

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
        ],
    },

    {
        icon: 'code',
        name: 'Tag',
        url: '/admin/categories',
        javascript: 'javascript:;',
        url: '/admin/tag',

        children: [
            {
                icon: 'plus',
                name: 'Add new',
                url: '/admin/tag/add',
                children: [],
            },
            {
                icon: 'default',
                name: 'List',
                url: '/admin/tag/list',
                children: [],
            },
        ],
    },
];
