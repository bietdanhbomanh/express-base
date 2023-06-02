const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

// require routes
const userRouter = require('./src/routes/User');

// require middlewares

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/user', userRouter);

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
    console.log(`Example app listening on 80`);
});

// const httpServer = http.createServer((req, res) => {
//     res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//     res.end();
// });

// const httpsServer = https.createServer(options, app);
// httpsServer.listen(443, () => {
//     console.log(`Example app listening on 443`);
// });
