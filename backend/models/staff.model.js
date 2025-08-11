const mongoose = require('mongoose')

const schema = mongoose.Schema;

let addressSchema = new schema({
    road: { type: String, required: [true, '"road" is a required field'], minLength: 2, maxLength: 20, trim: true, lowercase: true},
    number: { type: String, minLength:1, maxLength: 5, trim: true, uppercase: true}    // in case of "1150A", for example
})

let staffSchema = new schema({
    firstName: { type: String, required: [true, '"firstName" is a required field'], minLength: 2, maxLength: 20, trim: true, lowercase: true },
    lastName: { type: String, required: [true, '"lastName" is a required field'], minLength: 2, maxLength: 20, trim: true, lowercase: true },
    TIN: { type: String, required: [true, '"TIN" is a required field'], minLength: 9, maxLength: 9}    // in case it begins with 0
})