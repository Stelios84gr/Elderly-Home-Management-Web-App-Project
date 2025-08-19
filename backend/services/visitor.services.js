const Visitor = require('../models/visitor.model')

// .findOne() & .findAll() return a promise, so async functions

async function findAll() {
    const result = await Visitor.find();
    return result;
};

async function findOne(id) {
    const result = await Visitor.findById(id);
    return result;
}

module.exports = { findAll, findOne }