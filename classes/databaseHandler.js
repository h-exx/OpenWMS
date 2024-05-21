const postgres = require('postgres');
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
    }
}

module.exports = DatabaseHandler;