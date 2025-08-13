const Patient = require('../models/patient.model')

// .findAll() & .findAll() return a promise, so async functions

async function findAll() {
    const result = await Patient.find();
    return result;
};

async function findOne(id) {
    const result = await Patient.findById(id);
    return result;
}

module.exports = { findAll, findOne }