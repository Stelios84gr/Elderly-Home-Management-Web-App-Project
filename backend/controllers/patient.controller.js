const Patient = require('../models/patient.model');
const patientService = require('../services/patient.services');

exports.findAll = async(req, res) => {
    console.log("Retrieve all patients from 'patients' collection.");

    try {
        // const result = await Patient.find(); => delegated to patient.service

        const result = await patientService.findAll()
        res.status(200).json({status: true, data: result})
    } catch (err) {
        console.log("Error reading 'patients' collection.", err)
        res.status(400).json({ status: false, data: err})
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific patient.');
    const username = req.params.username;

    try {
        const result = await patientService.findOne(username);
        // const result = await Patient.findOne(username); => delegated to patient.services
        if (result) {   // not finding the patient does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Patient not found."})
        }
    } catch (err) {
        console.log('Error finding patient.', err);
        res.status(400).json({ status: false, data: err });
    }
}

exports.create = async(req, res) => {
    console.log('Create patient.');

    const data = req.body;

    const newPatient = new Patient({
        username: data.username,
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

    try {
        const result = await newPatient.save();
        res.status(201).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating patient.', err);
        res.status(400).json({ status: false, data: err});
    }
};

exports.update = async(req, res) => {
    const username = req.params.username;    // username will be retrieved from URL (path params)

    console.log("Update patient data by username: ", username, ".");

    try {
        const result = await Patient.findOneAndUpdate(
            {username: username},
            {$set: req.body},    // only update the fields sent (PATCH) - ignore fields not included in schemas
            {new: true, runValidators: true},    // runValidators applies validation checks also when updating
        );
        if (!result) {
            return res.status(404).json({ status: false, data: "Patient not found." })
        }
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating patient:", err);
        res.status(400).json({ status: false, data: err });
    }
};

exports.deleteByUsername = async (req, res) => {
    const username = req.params.username;
    console.log("Delete patient with username: ", username, ".");

    try {
        const result = await Patient.findOneAndDelete({username: username});

        // avoid returning status 200 - null if no patient is found
        if (!result) {
            return res.status(404).json({
                status: false, data: "Patient not found."
            });
        }

        res.status(200).json({ status: true, data: result })
    } catch (err) {
        console.log("Error deleting patient.", err);
        res.status(400).json({ status: false, data: err});
    }
};