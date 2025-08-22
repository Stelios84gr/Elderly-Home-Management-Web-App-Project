const Patient = require('../models/patient.model')

// .findOne() & .findAll() return a promise, so async functions

async function findAll() {
    const result = await Patient.find();
    return result;
};

async function findOne(username) {
    const result = await Patient.findOne(username);
    return result;
}

module.exports = { findAll, findOne }