const pg = require('pg');
const log = require('../utils/log.js');

class DatabaseHandler {
    connect() {
        this.db = postgres({
            host: '172.19.0.2',
            port: 5432,
            database: 'openwms',
            username: 'postgres',
            password: 'iamthepassword'
        }).catch((err) => {log.error(err)});
        const i = this.db`SELECT * FROM wards`;

        this.db = new pg.Client({
            host: '172.19.0.2',
            port: 5432,
            database: 'openwms',
            
        })

    }
}

module.exports = DatabaseHandler;