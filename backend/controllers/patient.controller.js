const patientService = require('../services/patient.service');
const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    console.log("Retrieve all patients from 'patients' collection.");

    try {
        // const result = await Patient.find(); => delegated to patient.service

        const result = await patientService.findAll();
        res.status(200).json({status: true, data: result});
    } catch (err) {
        console.log("Error reading 'patients' collection.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error reading all patients.", err);
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific patient.');
    
    const username = req.params.username;

    try {
        const result = await patientService.findOne(username);
        // const result = await Patient.findOne(username); => delegated to patient.service
        if (result) {   // not finding the patient does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Patient not found."});
            logger.error("Error finding patient.");
        }
    } catch (err) {
        console.log('Error finding patient.', err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error finding patient. ", err);
    };
};

exports.checkDuplicateUsername = async(req, res) => {
    const username = req.params.username;

    console.log("Check for duplicate username", username);
    
    try {
        const result = await patientService.findOne(username);
        if (result) {
            res.status(400).json({ status: false, data: result });
        } else {
            res.status(200).json({ status: true, data: result });
        };
    }   catch (err) {
        console.log(`Error finding username: ${username}`, err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error finding username.")
    };
};

exports.create = async(req, res) => {
    console.log('Create patient.');
    
    const data = req.body;

    try {
        const result = await patientService.create(data);
        res.status(201).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating patient.', err);
        logger.error("Error creating patient document.", err);
        res.status(400).json({ status: false, data: err});
    };
};

exports.update = async(req, res) => {
    const username = req.params.username;    // username will be retrieved from URL (path params)

    console.log("Update patient data by username: ", username, ".");

    const data = req.body;

    try {
        const result = await patientService.update(username, data);

        if (!result) {
            logger.error("Error finding patient.");
            return res.status(404).json({ status: false, data: "Patient not found." });
        };
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating patient.", err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error updating patient.", err);
    };
};

exports.deleteByUsername = async (req, res) => {
    const username = req.params.username;
    console.log("Delete patient with username: ", username, ".");

    try {
        const result = await patientService.deleteByUsername(username);

        // avoid returning status 200 & null if no patient is found
        if (!result) {
            logger.error("Patient not found");
            return res.status(404).json({ status: false, data: "Patient not found." });
        };

        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log("Error deleting patient.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error deleting patient.", err);
    };
};