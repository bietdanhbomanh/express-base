module.exports = (req, res, next) => {
    // Lấy URL hiện tại
    const url = req.originalUrl;

    // Tách các phần của URL thành mảng
    const parts = url
        .split('?')[0]
        .split('/')
        .filter((part) => part !== '');

    // Tạo mảng breadcrumbs
    const breadcrumbs = [];

    for (let i = 0; i < parts.length; i++) {
        const breadcrumb = {
            label: decodeURIComponent(parts[i]).replace(/-/g, ' ').toUpperCase(), // Giải mã và thay thế dấu '-' bằng khoảng trắng
            url: `/${parts.slice(0, i + 1).join('/')}`,
        };

        breadcrumbs.push(breadcrumb);
    }

    // Truyền danh sách breadcrumbs cho view
    res.locals.breadcrumbs = breadcrumbs;
    next();
};
