const express = require('express');
const router = express.Router();
const eventController = require('./event_Controller');

//Homepage events data
router.get('/home', eventController.getHomeEvents);
//Search event
router.get('/search', eventController.searchEvents);
//Event Details
router.get('/:event_id', eventController.getEventDetail);
//Get all categories
router.get('/categories', eventController.getCategories);

module.exports = router;