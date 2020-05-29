const express = require('express');
const pageController = require('../controller/pageController');
const router = express.Router();
const log = require('log4js').getLogger('index');


router.get('/:pageId', (req, res, next) => {
    log.debug(`I'm in the index module`);
    pageController.show(req, res, next);
});


module.exports = router;