const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');    // assigns all methods from patients.controller.js

router.get('/', patientController.findAll);
router.get('/:lastName', patientController.findOne);
router.post('/', patientController.create);

module.exports = router;