const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');    // assigns all methods from patients.controller.js

router.get('/', patientController.findAll);

module.exports = router;