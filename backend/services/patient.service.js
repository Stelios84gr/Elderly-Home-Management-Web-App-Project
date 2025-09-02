const Patient = require('../models/patient.model');

// auto-generate username based on pattern
function generatePatientUsername(firstName, lastName) {
  return `1${lastName.charAt(0).toLowerCase()}${firstName.toLowerCase()}${lastName.length}`;
};

// return a promise, so async functions

async function findAll() {
    const result = await Patient.find();

    return result;
};

async function findOne({ username }) {
    const result = await Patient.findOne({ username });
    
    return result;
};

async function create(data) {

    // auto-generate username
    const username = generatePatientUsername(data.firstName, data.lastName);

    const newPatient = new Patient({
        // not to be provided by the user
        username,
        firstName: data.firstName,
        lastName: data.lastName,
        AMKA: data.AMKA,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        authorizationToLeave: data.authorizationToLeave,
        roomData: {
            roomNumber: data.roomData?.roomNumber,
            bedNumber: data.roomData?.bedNumber
        },
        patientAilments: Array.isArray(data.patientAilments) ? data.patientAilments.map(ailment => ({
            disease: ailment.disease,
            severity: ailment.severity
        })) : [],    // optional chaining in nested fields to avoid runtime errors in case parent fields are accidentally missing in POST request
        emergencyContactInfo: {
            firstName: data.emergencyContactInfo?.firstName,
            lastName: data.emergencyContactInfo?.lastName,
            phoneNumber: data.emergencyContactInfo?.phoneNumber,
            address: {
                road: data.emergencyContactInfo?.address?.road,
                number: data.emergencyContactInfo?.address?.number
            },
            kinshipDegree: data.emergencyContactInfo?.kinshipDegree
        }
    });

    return await newPatient.save();
};

async function update(username, data) {

        const existing = await Patient.findOne({ username });
        if (!existing) return null;
    // username depends on firstName & lastName
        if(data.firstName || data.lastName) {
            data.username = generatePatientUsername(
                data.firstName ?? existing.firstName,
                data.lastName ?? existing.lastName
            );
        };

    const result = await Patient.findOneAndUpdate(
        { username },
        { $set: data },    // only update the fields sent from the controller (PATCH) & ignore fields not included in schemas
        { new: true, runValidators: true },    // runValidators applies validation checks also when updating
    );

    return result;
    };

async function deleteByUsername(username) {
    const result = await Patient.findOneAndDelete({ username });

    return result;
};

module.exports = { findAll, findOne, create, update, deleteByUsername };