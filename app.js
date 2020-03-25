const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, '/views/pages'),
    path.join(__dirname, 'views/partials')
])

app.set('layout', 'layout');
app.use(expressLayouts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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

app.get('/about', (req, res) => {
    res.render('about.ejs', {title: 'aboutPage'});
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})