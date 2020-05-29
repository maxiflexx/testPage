const express = require('express');
const router = express.Router();
const feedController = require('../controller/feedController');
const log = require('log4js').getLogger('feed');


router.post('/news', (req, res, next) => {
    log.debug(`I'm in the feed module`);
    feedController.getNews(req, res, next);
});

router.post('/analysis', (req, res, next) => {
    log.debug(`I'm in the feed module`);
    feedController.getAnalysis(req, res, next);
});

module.exports = router;