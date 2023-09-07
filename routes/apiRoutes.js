const express = require('express');
const router = express.Router();
const APIsController = require('../controllers/APIsController');

router.get('/mainSearch', APIsController.mainSearch);

module.exports = router;
