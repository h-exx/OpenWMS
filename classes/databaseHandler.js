const pg = require('pg');
const log = require('../utils/log.js');


class DatabaseHandler {
    constructor() {
        this.db = null;
    }
    async connect() {
        this.db = new pg.Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PWD
        });
        try {
            await this.db.connect();
            return this.db;
        } catch (err) {
            log.error(err);
            return false;
        }

    }
    close() {
        this.db.end();
    }
}

module.exports = DatabaseHandler;