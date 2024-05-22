const DatabaseHandler = require('./databaseHandler.js');
const log = require('../utils/log.js');

class Wards extends DatabaseHandler {
    async getAllWards() {
        log.info('Getting all wards');
        await this.connect();
        let data = await this.db.query("SELECT id, name FROM wards");
        this.close();
        return data.rows;
    }
    async getWard(id) {
        log.info(`Getting ward ${id}`);
        await this.connect();
        let data = await this.db.query("SELECT * FROM wards WHERE id = $1", [id]);
        this.close();
        return data.rows[0];

    }

    async updateWard(id, text) {
        log.info(`Updating ward ${id}`);
        await this.connect();
        let data = await this.db.query("UPDATE wards SET warddata=$1 WHERE id=$2", [JSON.stringify(text), id]);
        this.close();
        return true;
    }
}

const wards = new Wards();

module.exports = wards;