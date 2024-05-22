const c = require('ansi-colors');
const moment = require('moment');

module.exports = {
    log: (msg, time=Date.now()) => {
        console.log(`[${moment(time).format("Do-MMM-YYYY | HH:mm:ss")}] ${msg}`);
    },
    critical: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.bgRedBright("[CRITICAL]")} ${msg}`);
    },
    error: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.red("[ERROR]")} ${msg}`);
    },
    warn: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.yellow("[WARN]")} ${msg}`);
    },
    info: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.blue("[INFO]")} ${msg}`);
    },
    success: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.green("[SUCCESS]")} ${msg}`);
    },
    request: (msg, time=Date.now()) => {
        require('./log.js').log(`${c.magenta("[REQUEST]")} ${msg}`);
    }

}