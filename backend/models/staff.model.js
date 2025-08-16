const mongoose = require('mongoose')

const schema = mongoose.Schema;

let addressSchema = new schema({
    road: { type: String, required: [true, '"road" is a required field'], minLength: 2, maxLength: 20, trim: true, lowercase: true},
    number: { type: String, minLength:1, maxLength: 5, trim: true, uppercase: true}    // in case of "1150A", for example
})

let staffSchema = new schema({
    _id: { type: String, required: [true, '"id" is a required field'] },
    password: { type: String, required: [true, '"firstName" is a required field'], minLength: 8, maxLength: 16 },
    firstName: { type: String, required: [true, '"firstName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    lastName: { type: String, required: [true, '"lastName" is a required field'], minLength: 2, maxLength: 20, trim: true },
    TIN: { type: String, required: [true, '"TIN" is a required field'], minLength: 9, maxLength: 9, unique: true },    // in case it begins with 0
    occupation: { type: String, required: [true, '"occupation" is a required field'] , minLength: 5, maxLength: 20},
    startDate: { type: Date, default: Date.now },
    monthlySalary: { type: Number, required: [true, '"monthlySalary" is a required field'], min: 100, max: 9999  }
})