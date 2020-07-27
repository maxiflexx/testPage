require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const pageRouter = require('./routes/pages');
const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const fs = require('fs');
const log4js = require('log4js');
const favicon = require('serve-favicon');
const app = express();
log4js.configure(__dirname + '/config/log4js.json');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
 
app.use(session({
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

const log = log4js.getLogger('app');

app.use(helmet()); // 보안 이슈
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' })); // 모든 접근에 대해 기록

// 경로 설정 
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/public/static'));
app.use('/d3', express.static(__dirname + '/d3'));
// ejs 설정
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, '/views/pages'),
    path.join(__dirname, '/views/partials')
]);

// layout 설정
app.set('layout', 'layout');
app.use(expressLayouts);

// qs 분석
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(compression()); // 전송되는 데이터 압축



app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// 모든 요청에 대해 favicon.ico 무시
// app.get('*', (req, res, next) => {
//     if (req.originalUrl === '/favicon.ico') {
//         res.status(204).json({nope: true});
//     } else {
//         next();
//     }
// })

// 모든 요청에 대해 req.list는 pages의 파일 목록을 의미
app.get('*', (req, res, next) => {
    fs.readdir('./views/pages', (err, files) => {
        req.list = files;
        next();
    });
});

app.get('/', (req, res) => {
    res.render('index.ejs', {
        title:  'mainPage', 
        req: req
    });
});

app.get('/BTC.csv', (req, res) => {
    fs.readFile('./data/BTC.csv', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send(data);
    });
});

app.get('/EOS.csv', (req, res) => {
    fs.readFile('./data/EOS.csv', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send(data);
    });
});

app.get('/ETH.csv', (req, res) => {
    fs.readFile('./data/ETH.csv', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send(data);
    });
});

app.get('/XRP.csv', (req, res) => {
    fs.readFile('./data/XRP.csv', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send(data);
    });
});

app.get('/FTSE.csv', (req, res) => {
    fs.readFile('./data/FTSE.csv', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send(data);
    });
});

app.use('/', pageRouter);
app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    let err = new Error('Not Found!');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    log.error('Something went wrong:', err);
    res.status(err.status || 500);
    res.send(`
        <title>Error</title>
        <h1>${err.message}</h1>
        <h2>${err.status}</h2>
        <pre>${err.stack}</pre>
        `)
});

// 존재하지 않는 페이지에 접근했을 때의 에러처리
// app.use((req, res) => {
//     res.status(404).send('Sorry cant find that!');
// });

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});