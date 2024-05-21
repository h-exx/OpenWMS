const app = require('express')();
const fs = require('fs');
const log = require('./utils/log.js');

app.set('view engine', 'ejs')

app.get('/cdn/*', (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    res.sendFile(__dirname + "/public/" + req.url.split('/').slice(2).join('/'));
});

app.get('/*', (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    switch(req.url) {
        case '/':
            res.render('index.ejs', {query: req.query});
            break;
        case '/favicon.ico':
            res.sendStatus(404);
            break;
        default:
            let theURL = req.url.split('/').slice().join('/');
            res.render(theURL + '.ejs', {query: req.query});
    }
});

app.listen(process.env.PORT || 3000, () => {
   log.success(`Server started on port ${process.env.PORT || 3000}`);
});