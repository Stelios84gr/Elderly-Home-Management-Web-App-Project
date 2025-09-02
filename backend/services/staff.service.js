const Staff = require('../models/staff.model');
const bcrypt = require('bcrypt');

// auto-generate username based on pattern
function generateStaffUsername(firstName, lastName) {
  return `3${lastName.charAt(0).toLowerCase()}${firstName.toLowerCase()}${lastName.length}`;
};

// return a promise, so async functions

async function findAll() {
    const result = await Staff.find();

    return result;
};

// generic, instead of ({ username }), because it's used in both username and e-mai checkDuplicate front-end custom validators
async function findOne(filter) {
    const result = await Staff.findOne(filter);
    
    return result;
};

async function create(data) {
    
    const rounds = 12;
    let hashedPassword = '';
    if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, rounds);
    } else {
        hashedPassword = "";
    };

    // auto-generate username
    const username = generateStaffUsername(data.firstName, data.lastName);

    const newStaffMember = new Staff({
        // not to be provided by the user
        username,
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

    const existing = await Staff.findOne({ username });
    if (!existing) return null;

    // username depends on firstName & lastName
    if(data.firstName || data.lastName) {
        data.username = generateStaffUsername(
            data.firstName ?? existing.firstName,
            data.lastName ?? existing.lastName
        );
    };

    // if password is to be updated, hash it first
    if (data.password) {
        const rounds = 12;
        data.password = await bcrypt.hash(data.password, rounds);
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