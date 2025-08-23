const Staff = require('../models/staff.model');
const bcrypt = require('bcrypt');

// return a promise, so async functions

async function findAll() {
    const result = await Staff.find();

    return result;
};

async function findOne(username) {
    const result = await Staff.findOne({ username: username });
    
    return result;
};

async function create(data) {
    const rounds = 12;
    let hashedPassword = '';
    if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, rounds);
    } else {
        hashedPassword = "";
    }

    const newStaffMember = new Staff({
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        TIN: data.TIN,
        phoneNumber: data.phoneNumber,
        address: {
            road: data.address?.road,
            number: data.address?.number
        },
        occupation: data.occupation,
        roles: [data.roles],
        startDate: data.startDate,
        monthlySalary: data.monthlySalary,
        });

        return await newStaffMember.save();
};

async function update(username, data) {

    // if password is to be updated, hash it first
    if (data.password) {
        const rounds = 12;
        data.password = await bcrypt.hash(datap.assword, rounds);
    };

    const result = await Staff.findOneAndUpdate(
        { username },
        { $set: data },    // only update the fields sent from the controller (PATCH) & ignore fields not included in schemas
        { new: true, runValidators: true }    // runValidators applies validation checks also when updating
    );

    return result;
    };

async function deleteByUsername(username) {

    const result = await Staff.findOneAndDelete({ username });

    return result;
};

module.exports = { findAll, findOne, create, update, deleteByUsername };