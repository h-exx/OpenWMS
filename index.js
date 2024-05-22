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

// API

app.post('/api/addPatient', async (req, res, body) => {
    log.info(`${req.ip} POST ${req.url}`);
    const data = req.body;
    if (typeof data.lastName === 'undefined' || typeof data.firstName === 'undefined' || typeof data.nhsnum === 'undefined' || typeof data.sex === 'undefined' || typeof data.dob === 'undefined') {
        res.status(400).send('Missing Parameters');
        return;
    }

    const result = await patients.createPatient(`${data.lastName.toUpperCase()}, ${data.firstName}`, req.body.nhsnum, req.body.sex, req.body.dob);
    if (result[0]) {
        res.redirect('/patients?success=true');
    } else {
        res.redirect(`/patients?success=false&reason=${result[1]}`);
    }
});



app.listen(process.env.PORT || 3001, () => {
   log.success(`Server started on port ${process.env.PORT || 3000}`);
});