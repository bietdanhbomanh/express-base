const multer = require('multer');
const fs = require('fs');

const path = require('path');
const paginate = require('../../utils/pagination');
const { getError404 } = require('../../utils/getPage');

const basePath = 'public/uploads/';

const upload = multer({ dest: basePath });
module.exports = function (req, res) {
    const regex = /^\/admin\/file-manager(.*)/;

    let pathChild = decodeURIComponent(req.url.replace(regex, '$1'));
    pathChild = `${pathChild.split('?')[0]}`;

    switch (req.method) {
        case 'DELETE':
            if (typeof req.body.files === 'string') {
                const pathTarget = path.join(basePath, pathChild, `${decodeURIComponent(req.body.files)}`);
                if (fs.existsSync(pathTarget)) {
                    if (fs.lstatSync(pathTarget).isDirectory()) {
                        fs.rmSync(pathTarget, { recursive: true });
                    } else {
                        fs.unlinkSync(pathTarget);
                    }
                }
                res.json({ status: 1 });
            } else {
                req.body.files.forEach((file) => {
                    const pathTarget = path.join(basePath, pathChild, `${decodeURIComponent(file)}`);

                    if (fs.existsSync(pathTarget)) {
                        if (fs.lstatSync(pathTarget).isDirectory()) {
                            fs.rmSync(pathTarget, { recursive: true });
                        } else {
                            fs.unlinkSync(pathTarget);
                        }
                    }
                });
                res.json({ status: 1 });
            }
            break;

        case 'PUT':
            if (req.body.action == 'mkdir') {
                const targetPath = path.join(basePath, pathChild, `${req.body.dirName}`);
                fs.mkdir(targetPath, (err) => {
                    if (err) {
                        res.json({ status: 0 });
                    } else {
                        res.json({ status: 1 });
                    }
                });
            } else {
                upload.array('files[]')(req, res, (err) => {
                    if (err) {
                        res.json({ status: 0 });
                    }
                    const files = req.files;
                    files.forEach((file) => {
                        if (/^\.*\./.test(file.originalname)) {
                            file.originalname = file.originalname.replace(/^\.*\./, '');
                        }
                        const targetPath = path.join(basePath, pathChild, `${decodeURIComponent(file.originalname)}`);

                        fs.renameSync(file.path, targetPath, (err) => {
                            if (err) {
                                res.json({ status: 0 });
                            }
                        });
                    });
                    res.json({ status: 1 });
                });
            }
            break;

        default:
            if (!regex.test(req.url)) {
                return getError404(req, res);
            }

            const itemsPerPage = 18; // Số lượng item trên mỗi trang
            const currentPage = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)

            fs.readdir(basePath + pathChild, { withFileTypes: true }, (err, files) => {
                if (err) {
                    return getError404(req, res);
                }

                const fileItems = [];
                const dirItems = [];

                files.forEach((item) => {
                    const itemName = item.name;
                    const oneItem = { name: item.name };

                    if (item.isFile()) {
                        const filePath = path.join('/uploads', pathChild, itemName);
                        oneItem.path = filePath;
                        oneItem.isFile = true;
                        oneItem.extension = path.extname(itemName);

                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                        if (imageExtensions.includes(oneItem.extension.toLowerCase())) {
                            oneItem.isImage = true;
                        } else {
                            oneItem.isImage = false;
                        }

                        fileItems.push(oneItem);
                    } else if (item.isDirectory()) {
                        const dirPath = path.join(req.url, itemName);
                        oneItem.path = dirPath;
                        oneItem.isFile = false;
                        dirItems.push(oneItem);
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
            break;
    }
};
