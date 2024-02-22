const multer = require('multer');
const fs = require('fs');
const url = require('url');

const path = require('path');
const paginate = require('../../utils/pagination');
const { getError404, getRefresh } = require('../../utils/getPage');

const basePath = 'uploads/';

const upload = multer({ dest: basePath });
module.exports = {
    fileManager: function (req, res) {
        const parsedUrl = url.parse(req.url, true);
        const paths = parsedUrl.pathname.split('/');

        if (paths[2] !== 'file-manager') {
            return getError404(req, res);
        }

        let pathChild = parsedUrl.pathname.replace('/admin/file-manager/', '');
        pathChild = pathChild === parsedUrl.pathname ? '' : pathChild;

        const itemsPerPage = 12; // Số lượng item trên mỗi trang
        const currentPage = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)

        fs.readdir(basePath + `${decodeURIComponent(pathChild)}`, { withFileTypes: true }, (err, files) => {
            if (err) {
                return getError404(req, res);
            }

            const fileItems = [];
            const dirItems = [];

            files.forEach((item) => {
                const itemName = item.name;
                const one = { name: item.name };

                if (item.isFile()) {
                    const filePath = parsedUrl.pathname.replace('file-manager', 'file-view') + '/' + itemName;
                    one.path = filePath;
                    one.isFile = true;
                    one.extension = path.extname(itemName);

                    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                    if (imageExtensions.includes(one.extension.toLowerCase())) {
                        one.isImage = true;
                    } else {
                        one.isImage = false;
                    }

                    fileItems.push(one);
                } else if (item.isDirectory()) {
                    const dirPath = parsedUrl.pathname + '/' + itemName;
                    one.path = dirPath;
                    one.isFile = false;
                    dirItems.push(one);
                }
            });

            const all = [...dirItems, ...fileItems];

            const pagination = paginate(currentPage, itemsPerPage, all.length, all);

            res.locals.urlBack = req.url.split('/').slice(0, -1).join('/');
            res.locals.pathChild = pathChild;
            res.locals.pagination = pagination;
            res.locals.page = {
                shortTitle: 'File Manager',
                title: 'File Manager CMS ' + process.env.WEB,
            };

            res.render('admin/layout', { main: 'pages/fileManager' });
        });
    },
    fileUpload: function (req, res) {
        const parsedUrl = url.parse(req.url, true);
        let pathChild = parsedUrl.pathname.replace('/admin/file-manager/', '');
        pathChild = pathChild === parsedUrl.pathname ? '' : pathChild;

        if (req.body.dirName) {
            const targetPath = path.join(basePath, `${decodeURIComponent(pathChild)}`, `${req.body.dirName}`);
            fs.mkdir(targetPath, (err) => {
                if (err) {
                    res.json({ status: 'error' });
                } else {
                    res.json({ status: 'success' });
                }
            });
        } else {
            upload.array('files[]')(req, res, (err) => {
                if (err) {
                    return getError404;
                }
                const files = req.files;
                files.forEach((file) => {
                    const targetPath = path.join(basePath, `${decodeURIComponent(pathChild)}`, `${file.originalname}`);
                    fs.rename(file.path, targetPath, (err) => {
                        if (err) {
                            return getError404;
                        }
                    });
                });
                getRefresh(req, res);
            });
        }
    },
    fileDelete: function (req, res) {
        if (!req.body.files) {
            getRefresh(req, res);
        }

        const parsedUrl = url.parse(req.url, true);

        let pathChild = parsedUrl.pathname.replace('/admin/file-manager/', '');
        pathChild = pathChild === parsedUrl.pathname ? '' : pathChild;

        if (typeof req.body.files === 'string') {
            const pathTarget = path.join(
                basePath,
                `${decodeURIComponent(pathChild)}`,
                `${decodeURIComponent(req.body.files)}`
            );
            if (fs.existsSync(pathTarget)) {
                if (fs.lstatSync(pathTarget).isDirectory()) {
                    fs.rmSync(pathTarget, { recursive: true });
                } else {
                    fs.unlinkSync(pathTarget);
                }
                getRefresh(req, res);
            } else {
                getError404(req, res);
            }
        } else {
            req.body.files.forEach((file) => {
                const pathTarget = path.join(
                    basePath,
                    `${decodeURIComponent(pathChild)}`,
                    `${decodeURIComponent(file)}`
                );
                if (fs.existsSync(pathTarget)) {
                    if (fs.lstatSync(pathTarget).isDirectory()) {
                        fs.rmSync(pathTarget, { recursive: true });
                    } else {
                        fs.unlinkSync(pathTarget);
                    }
                } else {
                    getError404(req, res);
                }
            });
            getRefresh(req, res);
        }
    },

    viewFile: function (req, res) {
        const parsedUrl = url.parse(req.url, true);
        const paths = parsedUrl.pathname.split('/');

        if (paths[2] !== 'file-view' || paths[3] === '' || paths.length <= 3) {
            return getError404(req, res);
        }

        let pathChild = parsedUrl.pathname.replace('/admin/file-view/', '');

        pathChild = pathChild === parsedUrl.pathname ? '' : pathChild;

        let filePath = `${decodeURIComponent(basePath + pathChild.replace(/^\./, ''))}`;
        fs.access(`${filePath}`, fs.constants.F_OK, (err) => {
            if (err) {
                return getError404(req, res);
            }

            res.sendFile(path.resolve(filePath));
        });
    },
};
