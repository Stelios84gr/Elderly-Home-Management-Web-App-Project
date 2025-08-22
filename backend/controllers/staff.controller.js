const Staff = require('../models/staff.model');
const staffService = require('../services/staff.service');

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
    const id = req.params.id;    // find by id

    try {
        const result = await staffService.findById(id);    // cleaner than findOne({_id:id})
        // const result = await Staff.findById({id}); => delegated to staff.service
        if (result) {   // not finding the staff member does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Staff member not found."});
            logger.error("Error finding staff member.");
        }
    } catch (err) {
        console.log('Error finding staff member.', err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error finding patient. ", err);
    }
}

exports.create = async(req, res) => {
    console.log('Create staff member.');

    const data = req.body;

    try {
        const result = await staffService.create(data);
        res.status(201).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating staff member.', err);
        logger.error("Error creating staff document.", err);
        res.status(400).json({ status: false, data: err});
    };
};

exports.update = async(req, res) => {
    const id = req.params.id;    // id will be retrieved from URL (path params)

    console.log("Update staff member data by id: ", id, ".");

    try {
        const result = await Staff.findByIdAndUpdate(
            id,
            { $set: req.body },    // only update the fields sent (PATCH) - ignore fields not included in schemas
            { new: true, runValidators: true },    // runValidators applies validation checks also when updating
        );
        if (!result) {
            logger.error("Error finding patient.");
            return res.status(404).json({ status: false, data: "Staff member not found." })
        };
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating staff member:", err);
        res.status(400).json({ status: false, data: err });
        logger.error("Error updating patient.", err);
    };
};

exports.deleteById = async (req, res) => {
    const id = req.params.id;
    console.log("Delete staff member with id: ", id, ".");

    try {
        const result = await Staff.findByIdAndDelete(id);

        // avoid returning status 200 - null if no staff member is found
        if (!result) {
            logger.error("Patient not found");
            return res.status(404).json({ status: false, data: "Staff member not found." });
        }

        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log("Error deleting staff member.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error deleting patient.", err);
    };
};