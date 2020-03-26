const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const pageRouter = require('./routes/pages');
const fs = require('fs');
const app = express();

app.use(helmet()); // 보안 이슈

// 경로 설정 
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/public/static'));

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

// 모든 요청에 대해 favicon.ico 무시
app.get('*', (req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
})

// 모든 요청에 대해 req.list는 pages의 파일 목록을 의미
app.get('*', (req, res, next) => {
    fs.readdir('./views/pages', (err, files) => {
        req.list = files;
        next();
    });
});

app.get('/', (req, res) => {
    let drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
        { name: 'Scotch', drunkness: 10 },
    ];
    let tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('index.ejs', {
        drinks: drinks,
        tagline: tagline,
        title: 'mainPage'
    });
});

app.use('/', pageRouter);

// 존재하지 않는 페이지에 접근했을 때의 에러처리
app.use((req, res) => {
    res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});