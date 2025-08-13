const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');    // assigns all methods from patients.controller.js

router.get('/', patientController.findAll);
router.get('/:id', patientController.findOne);
router.post('/', patientController.create);
router.patch('/:id', patientController.update);

module.exports = router;