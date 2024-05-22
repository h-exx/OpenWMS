const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const log = require('./utils/log.js');
const dayjs = require('dayjs');

require('dotenv').config();

const patients = require('./classes/patients.js');
const wards = require('./classes/wards.js');

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
        res.render('patients/patient.ejs', {patient: patient, dayjs: dayjs, query: req.query});
    }
});

app.get('/wards', async (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    const ward = await wards.getAllWards();
    res.render('wards/index.ejs', {query: req.query, wards: ward});
});

app.get('/wards/admitPatient', async (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    const patientList = await patients.getAllPatients();
    const wardList = await wards.getAllWards();
    res.render('wards/admitPatient.ejs', {query: req.query, patients: patientList, wards: wardList});
});

app.get('/ward', async (req, res) => {
    log.info(`${req.ip} GET ${req.url}`);
    if (!req.query.id) {
        res.redirect('/wards');
    }
    const ward = await wards.getWard(req.query.id);
    const patientList = await patients.getAllPatients();
    res.render('wards/ward.ejs', {ward: ward, patients: patientList, query: req.query});
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

app.post('/api/admitPatient', async (req,res) => {
    let ward = await wards.getWard(req.body.wardid);
    console.log(ward);
    console.log(req.body);
    let bed = ward.warddata.find(element => element.id == req.body.bedid);
    bed.status = 'OCCUPIED';
    bed.patient = req.body.patientid;
    await wards.updateWard(req.body.wardid, ward.warddata);
    res.redirect(`/ward?id=${req.body.wardid}&success=true`);
});

app.post('/api/dischargePatient', async (req,res) => {
    let ward = await wards.getWard(req.body.wardid);
    let bed = ward.warddata.find(element => element.id == req.body.bedid);
    bed.status = 'CLEANING';
    bed.patient = null;
    await wards.updateWard(req.body.wardid, ward.warddata);
    res.redirect(`/ward?id=${req.body.wardid}&success=true`);
});

app.post('/api/cleanedBed', async (req,res) => {
    let ward = await wards.getWard(req.body.wardid);
    let bed = ward.warddata.find(element => element.id == req.body.bedid);
    bed.status = 'AVAILABLE';
    bed.patient = null;
    bed.reason = null;
    await wards.updateWard(req.body.wardid, ward.warddata);
    res.redirect(`/ward?id=${req.body.wardid}&success=true`);
});

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

app.post('/api/addHistory', async (req,res) => {
    log.info(`${req.ip} POST ${req.url}`);
    const data = req.body;
    if (typeof data.id === 'undefined' || typeof data.text === 'undefined') {
        res.redirect('/patients?success=false&reason=MISSINGPARAMS');
        return;
    }
    const result = await patients.addPatientHistory(data.id, data.text);
    if (result[0]) {
        res.redirect(`/patient?id=${data.id}&success=true`);
    } else {
        res.redirect(`/patient?id=${data.id}&success=false&reason=${result[1]}`);
    }
});



app.listen(process.env.PORT || 3000, () => {
   log.success(`Server started on port ${process.env.PORT || 3000}`);
});