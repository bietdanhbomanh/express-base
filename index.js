const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

const User = require('./src/models/User');

const loadConfig = require('./src/middlewares/loadConfig');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(loadConfig);

app.get('/', (req, res) => {
    User.findAll().then((data) => {
        console.log(
            'Tất cả người dùng:',
            data.map((user) => user.toJSON())
        );
    });
    res.render('admin/layout', { title: 'John', view: 'user/login' });
});

app.post('/register', async (req, res) => {
    try {
        const data = await User.findOne({ where: { username: req.body.username } });
        if (data) {
            res.json({ error: 'Tài khoản đã tồn tại.' });
        } else {
            const createdUser = await User.create(req.body);
            res.json(createdUser.toJSON());
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi trên máy chủ.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const data = await User.findOne({ where: req.body });
        if (data) {
            res.json({ ok: 'OK' });
        } else {
            res.json({ error: 'Không đúng' });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi trên máy chủ.' });
    }
});

// const httpServer = http.createServer((req, res) => {
//     res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//     res.end();
// });
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
    console.log(`Example app listening on 80`);
});

// const httpsServer = https.createServer(options, app);
// httpsServer.listen(443, () => {
//     console.log(`Example app listening on 443`);
// });
