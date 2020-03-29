const log4js = require('log4js');
const path = require('path');

log4js.configure('D:\\Dropbox\\임근혁\\수업자료\\study\\testPage\\log4js.config.json');
let logger = log4js.getLogger('System');

module.exports.error = (text) => {
    logger.error(text);
}

module.exports.debug = (text) => {
    logger.debug(text);
}
