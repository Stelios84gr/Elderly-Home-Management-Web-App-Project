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
    const lastName = req.params.lastName;    // find by lastName

    try {
        const result = await patientService.findOne(lastName);
        // const result = await Patient.findOne({lastName: lastName}); => delegated to patient.services
        if (result) {   // not finding the user does not raise an error and go to catch
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
    console.log('Create Patient.');

    const data = req.body;

    const newPatient = new Patient({
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
                road: data.emergencyContactInfo?.address.road,
                number: data.emergencyContactInfo?.address.number
            },
            kinshipDegree: data.emergencyContactInfo.kinshipDegree
        }
    });

    try {
        const result = await newPatient.save();
        res.status(200).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating patient.', err);
        res.status(400).json({ status: false, data: err});
    }
};

exports.update = async(req, res) => {
    const lastName = req.body.lastName;

    console.log("Update patient data by lastName.", lastName);

    const data = req.body;

    const updatePatient = {
        firstName: data.firstName,
        lastName: data.lastName,
        AMKA: data.AMKA,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        authorizationToLeave: data.authorizationToLeave,
        roomData: {
            roomNumber: data.roomNumber,
            bedNumber: data.bedNumber
        },
        patientAilments: Array.isArray(data.patientAilments) ? data.patientAilments.map(ailment => ({
            disease: ailment.disease,
            severity: ailment.severity
        })) : [],
        emergencyContactInfo: {
            firstName: data.emergencyContactInfo?.firstName,
            lastName: data.emergencyContactInfo?.lastName,
            phoneNumber: data.emergencyContactInfo?.phoneNumber,
            address: {
                road: data.emergencyContactInfo?.address.road,
                number: data.emergencyContactInfo?.address.number
            },
            kinshipDegree: data.emergencyContactInfo?.kinshipDegree
        }
    };

    try {
        const result = await Patient.findOneAndUpdate({lastName:lastName}, updatePatient, {new: true});
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating patient.", err);
        res.status(400).json({ status: false, data: err });
    }
};