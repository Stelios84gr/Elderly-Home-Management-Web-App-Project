const Patient = require('../models/patient.model')

function findAll() {
    const result = Patient.find();
    return result;
}