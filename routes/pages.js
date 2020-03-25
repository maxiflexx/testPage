const express = require('express');
const pageController = require('../controller/pageController');
const router = express.Router();

router.get('/:pageId', pageController.show);

module.exports = router;