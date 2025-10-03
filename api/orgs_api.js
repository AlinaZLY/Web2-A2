const express = require('express');
const router = express.Router();
const orgController = require('./org_Controller');

//Get all organizations
router.get('/', orgController.getAllOrganizations);
//Get events of an organization
router.get('/:org_id/events', orgController.getEventsByOrg);

module.exports = router;