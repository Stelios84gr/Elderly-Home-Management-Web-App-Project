const Staff = require('../models/staff.model')

// .findOne() & .findAll() return a promise, so async functions

async function findAll() {
    const result = await Staff.find();
    return result;
};

async function findOne(id) {
    const result = await Staff.findById(id);
    return result;
}

module.exports = { findAll, findOne }