const Visitor = require('../models/visitor.model')

// return a promise, so async functions

async function findAll() {
    const result = await Visitor.find();
    return result;
};

async function findOne(username) {
    const result = await Visitor.findOne({ username: username });
    return result;
}

async function create(data) {

    const newVisitor = new Visitor({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: {
            road: data.address?.road,
            number: data.address?.number
        },
        relationship: data.relationship,
        isFamily: data.isFamily
    });

    return await newVisitor.save();
};

async function update(username, data) {

    const result = await Visitor.findOneAndUpdate(
        { username },
        { $set: data },    // only update the fields sent from the controller (PATCH) & ignore fields not included in schemas
        { new: true, runValidators: true },    // runValidators applies validation checks also when updating
    );

    return result;
};

async function deleteByUsername(username) {
    const result = await Visitor.findOneAndDelete({ username });

    return result;
};

module.exports = { findAll, findOne, create, update, deleteByUsername };