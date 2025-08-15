const Staff = require('../models/staff.model');
const staffService = require('../services/staff.services');

exports.findAll = async(req, res) => {
    console.log("Retrieve all staff members from 'staff' collection.");

    try {
        // const result = await Staff.find(); => delegated to staff.service

        const result = await staffService.findAll()
        res.status(200).json({status: true, data: result})
    } catch (err) {
        console.log("Error reading 'staff' collection.", err)
        res.status(400).json({ status: false, data: err})
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific staff member.');
    const id = req.params.id;    // find by id

    try {
        const result = await staffService.findById(id);    // cleaner than findOne({_id:id})
        // const result = await Staff.findById({id}); => delegated to staff.services
        if (result) {   // not finding the staff member does not raise an error and go to catch
            res.status(200).json({ status: true, data: result});
        }   else {
            res.status(404).json({ status: false, data: "Staff member not found."})
        }
    } catch (err) {
        console.log('Error finding staff member.', err);
        res.status(400).json({ status: false, data: err });
    }
}

exports.create = async(req, res) => {
    console.log('Create staff member.');

    const data = req.body;

    const newStaffMember = new Staff({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        TIN: data.TIN,
        phoneNumber: data.phoneNumber,
        address: {
            road: data.address?.road,
            number: data.address?.number
        },
        monthlySalary: data.monthlySalary,
        })

    try {
        const result = await newStaffMember.save();
        res.status(200).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating staff member.', err);
        res.status(400).json({ status: false, data: err});
    }
};

exports.update = async(req, res) => {
    const id = req.params.id;    // id will be retrieved from URL (path params)

    console.log("Update staff member data by id: ", id, ".");

    try {
        const result = await Staff.findByIdAndUpdate(
            id,
            { $set: req.body},    // only update the fields sent (PATCH) - ignore fields not included in schemas
            {new: true, runValidators: true},    // runValidators applies validation checks also when updating
        );
        if (!result) {
            return res.status(404).json({ status: false, data: "Staff member not found." })
        }
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating staff member:", err);
        res.status(400).json({ status: false, data: err });
    }
};

exports.deleteById = async (req, res) => {
    const id = req.params.id;
    console.log("Delete staff member with id: ", id, ".");

    try {
        const result = await Staff.findByIdAndDelete(id);

        // avoid returning status 200 - null if no staff member is found
        if (!result) {
            return res.status(404).json({
                status: false, data: "Staff member not found."
            });
        }

        res.status(200).json({ status: true, data: result })
    } catch (err) {
        console.log("Error deleting staff member.", err);
        res.status(400).json({ status: false, data: err});
    }
};