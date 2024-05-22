const log = require('../utils/log.js');
const DatabaseHandler = require('./databaseHandler.js');

class Patients extends DatabaseHandler {
    async getAllPatients() {
        log.info('Getting all patients');
        await this.connect();
        let data = await this.db.query("SELECT id, nhsnum, name FROM patient_info");
        this.close();
        return data.rows;
    }
    async getPatient(id) {
        log.info(`Getting patient ${id}`);
        await this.connect();
        let data = await this.db.query("SELECT * FROM patient_info WHERE id = $1", [id]);
        this.close();
        return data.rows[0];
    }

    async createPatient(name, nhsnum, sex, dob) {
        log.info(`Creating patient ${name}`);
        await this.connect();
        const res = await this.db.query("INSERT INTO patient_info (name, nhsnum, sex, dob) VALUES ($1, $2, $3, $4) RETURNING id", [name, nhsnum, sex, dob]);
        console.log(res);
        this.close();
        console.log(res);
        return [true, res.rows[0].id];
    }
}

const patients = new Patients()

module.exports = patients;