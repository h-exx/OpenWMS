const express = require('express');
const fs = require('fs');
const { request } = require('http');

const app = express();

const data = {}

function updateData() {
    fs.writeFileSync('./data.json', JSON.stringify(data));
}

app.set('view engine', 'ejs');

app.get('/resetALL', (req,res) => {
    res.write('Resetting all data...\n\n');
    const data = JSON.parse(fs.readFileSync('./exampleData.json'));
    fs.writeFileSync('./data.json', JSON.stringify(data));
    res.end('Resetted successfully.');
});

app.get('/*', (req,res) => {
    if (req.url == '/') {
        requestPath = '/index';
    } else if (req.url == '/favicon.ico') {
        res.sendStatus(404);
    } else {
        requestPath = req.url;
    }
    res.render(__dirname + '/web/index.ejs', {selected: requestPath.split('/')[1], mainCode: requestPath, data: data});
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on Port ${process.env.PORT || 3000}`);
});