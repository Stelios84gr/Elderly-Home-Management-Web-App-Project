const mongoose = require('mongoose');

const schema = mongoose.Schema;

let roomDataSchema = new schema({
    roomNumber: {type: String, required: [true, '"roomNumber" is a required field'], minLength: 2, maxLength: 2, trim: true },
    bedNumber : { type: String, required: [true, '"bedNumber" is a required field'], minLength: 4, maxLength: 4, trim: true }
}, {_id: false});    // prevents Mongoose assigning _id for roomDataSchema

let patientAilmentsSchema = new schema({
    disease: { type: String, required: [true, '"disease" is a required field'], minLength:3, maxLength: 25, trim: true, lowercase: true },
    severity: { type: Number, required: [true, '"disease" is a required field'], min: 1, max: 5 }
}, {_id: false});

let emergencyContactInfoSchema = new schema({
    firstName: { type: String, required: [true, '"firstName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    lastName: { type: String, required: [true, '"lastName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    phoneNumber: { type: Number, required: [true, '"phoneNumber" is a required field'], min: 1000000000, max: 9999999999, unique: true },       // min-max: ensures 10-digit format
    address: {
        street: { type: String, minLength: 2, maxLength: 20, trim: true },
        number: { type: String, minLength: 1, maxLength: 5, trim: true, uppercase: true }    // in case of "1150A", for example
    },
    kinshipDegree: { type: String, required: [true, '"kinshipDegree" is a required field'], minLength: 3, maxLength: 15, trim: true, lowercase: true },
}, {_id: false});

let visitorsSchema = new schema({   // both nested fields aren't required, as visitors are assigned after patient creation (app logic)
    firstName: {type: String, required: [true, '"firstName" is a required field'], minLength: 3, maxLength: 15 },
    lastName: {type: String, required: [true, '"lastName" is a required field'], minLength: 3, maxLength: 15 },
    relationship: { type: String, minLength: 3, maxLength: 15, trim: true, lowercase: true }
});

let patientSchema = new schema({
    username: { type: String, required: [true, '"username" is a required field'], minLength: 4, trim: true, lowercase: true, unique: true },
    firstName: { type: String, required: [true, '"firstName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    lastName: { type: String, required: [true, '"lastName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    AMKA: { type: String, required: [true, '"AMKA" is a required field'], minLength: 11, maxLength: 11, trim: true, unique: true },   // in case it begins with 0
    dateOfBirth: { type: Date, required: [true, '"dateOfBirth" is a required field'] },
    phoneNumber: { type: Number, required: [true, '"phoneNumber" is a required field'], min: 1000000000, max: 9999999999, unique: true },
    authorizationToLeave: { type: Boolean, defalut: false },
    roomData: roomDataSchema,
    patientAilments: {
        type: [patientAilmentsSchema],    // array because there might be more than one
        validate: {
            validator: function(arr) {
                return arr.length > 0;    // should have at least 1 ailment
            },
            message: "Patient must have at least one ailment."
        },
    },
    emergencyContactInfo: emergencyContactInfoSchema,
    visitors: { type: [visitorsSchema], default: []}    // no visitors array upon creation since they are added later on
}, { versionKey: false});    // remove _v

module.exports = mongoose.model('Patient', patientSchema);
// Swagger will use schemas, not models
module.exports.patientSchema = patientSchema;