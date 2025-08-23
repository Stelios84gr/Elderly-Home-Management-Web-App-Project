const mongoose = require('mongoose');

const schema = mongoose.Schema;

let addressSchema = new schema({
    road: { type: String, minLength: 2, maxLength: 20, trim: true },
    number: { type: String, minLength: 1, maxLength: 5, trim: true, uppercase: true }    // in case of "1150A", for example
});

let visitorSchema = new schema({
    username: { type: String, required: [true, '"username" is a required field'], unique: true },
    firstName: { type: String, required: [true, '"firstName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    lastName: { type: String, required: [true, '"lastName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    phoneNumber: { type: Number, required: [true, '"phoneNumber" is a required field'], min: 1000000000, max: 9999999999 },        // min-max: ensures 10-digit format
    address: addressSchema,
    relationship: { type: String, required: [true, "relationship is a required field"], minLength: 4, maxLength: 15, trim: true, lowercase: true },
    isFamily: { type: Boolean, required: [true, "isFamily is a required field"] }
});

module.exports = mongoose.model('Visitor', visitorSchema);
// Swagger will use schemas, not models
module.exports.visitorSchema = visitorSchema;