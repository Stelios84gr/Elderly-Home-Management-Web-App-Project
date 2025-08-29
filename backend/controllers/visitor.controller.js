const visitorService = require('../services/visitor.service');
const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    console.log("Retrieve all visitors from 'visitors' collection.");

    try {
        // const result = await Visitor.find(); => delegated to visitor.service

        const result = await visitorService.findAll();
        res.status(200).json({status: true, data: result});
    } catch (err) {
        console.log("Error reading 'visitors' collection.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error reading all visitors.", err);
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific visitor.');
    const username = req.params.username;    // find by username

    try {
        const result = await visitorService.findOne(username);
        // const result = await Visitor.findOne(username); => delegated to visitor.service
        if (result) {   // not finding the visitor does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Visitor not found."});
            logger.error("Error finding visitor.");
        }
    } catch (err) {
        console.log('Error finding visitor.', err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error finding visitor.", err);
    };
};

exports.checkDuplicateUsername = async(req, res) => {
    const username = req.params.username;

    console.log("Check for duplicate username", username);
    
    try {
        const result = await visitorService.findOne(username);
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
    console.log('Create visitor.');

    const data = req.body;

    try {
        const result = await visitorService.create(data);
        res.status(201).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating visitor.', err);
        logger.error("Error creating visitor document.", err);
        res.status(400).json({ status: false, data: err});
    };
};

exports.update = async(req, res) => {
    const username = req.params.username;    // username will be retrieved from URL (path params)

    console.log("Update viistor data by username: ", username, ".");

    const data = req.body;

    try {
        const result = await visitorService.update(username, data);
        if (!result) {
            logger.error("Error finding visitor.");
            return res.status(404).json({ status: false, data: "Visitor not found." })
        }
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating visitor.", err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error updating visitor.", err);
    };
};

exports.deleteByUsername = async (req, res) => {
    const username = req.params.username;
    console.log("Delete visitor with username: ", username, ".");

    try {
        const result = await visitorService.deleteByUsername(username);

        // avoid returning status 200 & null if no visitor is found
        if (!result) {
            logger.error("Visitor not found");
            return res.status(404).json({
            status: false, data: "Visitor not found."
            });
        };

        res.status(200).json({ status: true, data: result })
    } catch (err) {
        console.log("Error deleting visitor.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error deleting visitor.", err);
    };
};