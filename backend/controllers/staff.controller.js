const staffService = require('../services/staff.service');
const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    console.log("Retrieve all staff members from 'staff' collection.");

    try {
        // const result = await Staff.find(); => delegated to staff.service

        const result = await staffService.findAll();
        res.status(200).json({status: true, data: result});
    } catch (err) {
        console.log("Error reading 'staff' collection.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error reading all staff members.", err);
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific staff member.');

    const username = req.params.username;    // find by username

    try {
        const result = await staffService.findOne(username);
        if (result) {   // not finding the staff member does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Staff member not found."});
            logger.error("Error finding staff member.");
        }
    } catch (err) {
        console.log('Error finding staff member.', err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error finding staff member.", err);
    };
};

exports.checkDuplicateEmail = async(req, res) => {
    console.log("Check for duplicate e-mail address", email);

    const email = req.params.email;

    try {
        const result = await staffService.findOne(email);
        if (result) {
            res.status(400).json({ status: false, data: result });
        } else {
            res.status(200).json({ status: true, data: result });
        };
    }   catch (err) {
        console.log(`Error finding e-mail address: ${email}`, err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error finding e-mail addresss.")
    };
};

exports.create = async(req, res) => {
    console.log('Create staff member.');

    const data = req.body;

    try {
        const result = await staffService.create(data);
        res.status(201).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating staff member.', err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error creating staff document.", err);
    };
};

exports.update = async(req, res) => {
    console.log("Update staff member data by username: ", username, ".");

    const username = req.params.username;    // username will be retrieved from URL (path params)

    const data = req.body;

    try {
        const result = await staffService.update(username, data);

        if (!result) {
            logger.error("Error finding staff member.");
            return res.status(404).json({ status: false, data: "Staff member not found." });
        };
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating staff member:", err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error updating staff member.", err);
    };
};

exports.deleteByUsername = async (req, res) => {
    console.log("Delete staff member with username: ", username, ".");

    const username = req.params.username;
    
    try {
        const result = await staffService.deleteByUsername(username);

        // avoid returning status 200 & null if no staff member is found
        if (!result) {
            logger.error("Staff member not found");
            return res.status(404).json({ status: false, data: "Staff member not found." });
        }

        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log("Error deleting staff member.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error deleting staff member.", err);
    };
};