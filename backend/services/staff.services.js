const Staff = require('../models/staff.model')

// .findOne() & .findAll() return a promise, so async functions

async function findAll() {
    const result = await Staff.find();
    return result;
};

async function findOne(id) {
    const result = await Staff.findById(id);
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
        monthlySalary: data.monthlySalary,
        });

        return await newStaffMember.save();
};

module.exports = { findAll, findOne, create }