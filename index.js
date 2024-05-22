const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const log = require('./utils/log.js');

require('dotenv').config();

const patients = require('./classes/patients.js');

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));

app.get('/cdn/*', (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    res.sendFile(__dirname + "/public/" + req.url.split('/').slice(2).join('/'));
});

app.get('/patients', async (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    const patientList = await patients.getAllPatients();
    res.render('patients/index.ejs', {query: req.query, patientList: patientList});
});

app.get('/patient', async (req,res) => {
    log.info(`${req.ip} GET ${req.url}`)
    if(!req.query.id) {
        req.redirect('/patients')
    } else {
        const id = req.query.id;
        const patient = await patients.getPatient(id);
        res.render('patients/patient.ejs', {patient: patient})
    }
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
            let theURL = req.url.split('/').slice(1).join('/');
            res.render(theURL + '.ejs', {query: req.query});
    }
});

app.listen(process.env.PORT || 3000, () => {
   log.success(`Server started on port ${process.env.PORT || 3000}`);
});