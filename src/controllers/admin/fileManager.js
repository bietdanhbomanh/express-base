const multer = require('multer');
const fs = require('fs');

const path = require('path');
const paginate = require('../../utils/pagination');
const { getErrorPage } = require('../../utils/getPage');

const basePath = 'public/uploads/';

const upload = multer({ dest: basePath });
module.exports = function (req, res) {
    const [pathOriginal, _] = req.originalUrl.split('?');
    res.locals.queryString = _ || '';
    req.url = pathOriginal;
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
                    const result = [];
                    const files = req.files;
                    files.forEach((file) => {
                        file.originalname = res.locals.helpers.handleFileName(file.originalname);
                        let targetPath = path.join(basePath, pathChild, `${decodeURIComponent(file.originalname)}`);

                        // Kiểm tra nếu file đã tồn tại tại targetPath
                        if (fs.existsSync(targetPath)) {
                            const filenameWithoutExt = path.basename(
                                file.originalname,
                                path.extname(file.originalname)
                            );
                            const fileExt = path.extname(file.originalname);
                            let index = 1;
                            // Thêm số đếm vào tên file cho đến khi tìm được một tên không trùng
                            while (fs.existsSync(targetPath)) {
                                targetPath = path.join(
                                    basePath,
                                    pathChild,
                                    `${filenameWithoutExt} (${index})${fileExt}`
                                );
                                index++;
                            }
                        }

                        fs.renameSync(file.path, targetPath, (err) => {
                            if (err) {
                                res.json({ status: 0, message: err.message });
                            }
                        });
                        result.push(targetPath.replace(/\\/g, '/').replace(/^public/, ''));
                    });
                    res.json({ status: 1, delay: 2000, data: result });
                });
            }
            break;

        default:
            if (!regex.test(req.url)) {
                return getErrorPage(req, res);
            }

            const itemsPerPage = parseInt(req.query.size) || 18;
            const currentPage = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
            res.locals.type = req.query.type || '';
            res.locals.CKEditorFuncNum = req.query.CKEditorFuncNum || '';

            fs.readdir(basePath + pathChild, { withFileTypes: true }, (err, files) => {
                if (err) {
                    return getErrorPage(req, res);
                }

                files = files
                    .filter((file) => file.isFile())
                    .sort((a, b) => {
                        return (
                            fs.statSync(basePath + pathChild + '/' + b.name).mtime.getTime() -
                            fs.statSync(basePath + pathChild + '/' + a.name).mtime.getTime()
                        );
                    });

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

                        const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.mkv', '.flv'];
                        const imageExtensions = [
                            '.jpg',
                            '.jpeg',
                            '.png',
                            '.gif',
                            '.bmp',
                            '.webp',
                            '.svg',
                            '.tiff',
                            '.ico',
                        ];

                        if (
                            imageExtensions.includes(
                                oneItem.extension.toLowerCase() ||
                                    videoExtensions.includes(oneItem.extension.toLowerCase())
                            )
                        ) {
                            oneItem.isDisplay = true;
                        } else {
                            oneItem.isDisplay = false;
                        }

                        switch (res.locals.type) {
                            case 'image':
                            case '':
                                imageExtensions.includes(oneItem.extension.toLowerCase()) && fileItems.push(oneItem);
                                break;
                            case 'all':
                                fileItems.push(oneItem);

                                break;
                            case 'video':
                                videoExtensions.includes(oneItem.extension.toLowerCase()) && fileItems.push(oneItem);
                                break;
                            default:
                                !imageExtensions.includes(oneItem.extension.toLowerCase()) &&
                                    !videoExtensions.includes(oneItem.extension.toLowerCase()) &&
                                    fileItems.push(oneItem);

                                break;
                        }
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

                const main = req.query.CKEditorFuncNum || req.query.select ? 'pages/fileSelect' : 'pages/fileManager';

                res.render('admin/layout', { main });
            });
    }
};
