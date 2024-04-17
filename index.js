require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const { connectDB } = require('./config/db');
const loadConfig = require('./src/middlewares/loadConfig');
const loadBreadcrumb = require('./src/middlewares/loadBreadcrumb');


const connectRedis = require('connect-redis').default;
const { createClient } = require('ioredis');
// const serveImage = require('./src/middlewares/image');

const redisClient = createClient();
const redisStore = new connectRedis({ client: redisClient, ttl: 3600 });

connectDB();

const adminRoute = require('./src/routes/admin');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        store: redisStore,
        secret: process.env.KEY,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: {},
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static(__dirname + '/public'));
app.use(loadConfig, loadBreadcrumb);
app.use(adminRoute);

const httpServer = http.createServer(app);
const port = process.env.PORT;

httpServer.listen(port, () => {
    console.log(`App listening on ${port}`);
});
