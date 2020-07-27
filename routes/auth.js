const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();
const log = require('log4js').getLogger('auth');

router.post('/register', (req, res, next) => {
    log.debug(`I'm in the auth module`);
    authController.register(req, res, next)
});

router.post('/mailSender', (req, res, next) => {
    log.debug(`I'm in the auth module`);
    authController.mailSender(req, res, next);
})

router.post('/login', (req, res, next) => {
    log.debug(`I'm in the auth module`);
    authController.login(req, res, next);
});

router.get('/logout', (req, res, next) => {
    log.debug(`I'm in the auth module`);
    authController.logout(req, res, next);
});

module.exports = router;