const express = require('express');
const router = express.Router();
const APIsController = require('../controllers/APIsController');

router.get('/mainSearch', APIsController.mainSearch);
router.get('/onLoadGoogleAPISearch', APIsController.onLoadGoogleAPISearch);
router.get('/googlePlaceSearch', APIsController.googlePlaceSearch);
router.get('/googlePlaceDetails', APIsController.placeDetails);

module.exports = router;
