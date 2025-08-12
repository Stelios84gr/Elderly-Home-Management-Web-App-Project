const Patient = require('../models/patient.model')

exports.findAll = async(req, res) => {
    console.log("Retrieve all patients from 'patients' collection.")

    try {
        const result = await Patient.find();

        res.status(200).json({status: true, data: result})
    } catch (err) {
        console.log("Error reading 'patients' collection.", err)
        res.status(400).json({ status: false, data: err})
    }
}