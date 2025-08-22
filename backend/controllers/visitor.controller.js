const Visitor = require('../models/visitor.model');
const visitorService = require('../services/visitor.service');

exports.findAll = async(req, res) => {
    console.log("Retrieve all visitors from 'visitors' collection.");

    try {
        // const result = await Visitor.find(); => delegated to visitor.service

        const result = await visitorService.findAll();
        res.status(200).json({status: true, data: result});
    } catch (err) {
        console.log("Error reading 'visitors' collection.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error reading all patients.", err);
    };
};

exports.findOne = async(req, res) => {
    console.log('Find a specific visitor.');
    const id = req.params.id;    // find by id

    try {
        const result = await visitorService.findById(id);    // cleaner than findOne({_id:id})
        // const result = await Visitor.findById({id}); => delegated to visitor.service
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
    }
}

exports.create = async(req, res) => {
    console.log('Create visitor.');

    const data = req.body;

    const newVisitor = new Visitor({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: {
            road: data.address?.road,
            number: data.address?.number
        },
        relationship: data.relationship,
        isFamily: data.isFamily
    });

    try {
        const result = await newVisitor.save();
        res.status(200).json({ status: true, data: result});
    } catch (err) {
        console.log('Error creating visitor.', err);
        logger.error("Error creating visitor document.", err);
        res.status(400).json({ status: false, data: err});
    }
};

exports.update = async(req, res) => {
    const id = req.params.id;    // id will be retrieved from URL (path params)

    console.log("Update viistor data by id: ", id, ".");

    try {
        const result = await Visitor.findByIdAndUpdate(
            id,
            { $set: req.body},    // only update the fields sent (PATCH) - ignore fields not included in schemas
            {new: true, runValidators: true},    // runValidators applies validation checks also when updating
        );
        if (!result) {
            logger.error("Error finding visitor.");
            return res.status(404).json({ status: false, data: "Visitor not found." })
        }
        res.status(200).json({ status: true, data: result });
    }   catch (err) {
        console.log("Error updating visitor.", err);
        res.status(400).json({ status: false, data: err });
         logger.error("Error updating patient.", err);
    }
};

exports.deleteById = async (req, res) => {
    const id = req.params.id;
    console.log("Delete visitor with id: ", id, ".");

    try {
        const result = await Visitor.findByIdAndDelete(id);

        // avoid returning status 200 - null if no visitor is found
        if (!result) {
            logger.error("Visitor not found");
            return res.status(404).json({
                status: false, data: "Visitor not found."
            });
        }

        res.status(200).json({ status: true, data: result })
    } catch (err) {
        console.log("Error deleting visitor.", err);
        res.status(400).json({ status: false, data: err});
        logger.error("Error deleting patient.", err);
    }
};