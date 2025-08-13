const express = require("express");
const app = express();

app.use(express.json());    // express parses JSON files in HTTP requests

const patient = require('./routes/patient.routes');
// const visitor = require( './routes/visitor.routes');
// const staff = require('./routes/staff.routes');

app.use('/api/patients', patient)


module.exports = app