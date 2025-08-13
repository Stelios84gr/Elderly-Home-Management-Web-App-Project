const Patient = require('../models/patient.model')

function findAll() {
    const result = Patient.find();
    return result;
};

function findOne(lastName) {
    const result = UserActivation.findOne({lastName:lastName});
    return result;
}

module.exports = { findAll, findOne }