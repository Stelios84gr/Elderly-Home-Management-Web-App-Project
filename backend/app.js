const express = require("express");
const app = express();

app.use(express.json());

const patient = require('./routes/patient.routes');
const visitor = require( './routes/visitor.routes');
const staff = require('./routes/staff.routes');
const auth = require('./routes/auth.routes');

app.use('/api/auth', auth)
app.use('/api/patients', patient);
app.use('/api/staff', staff);
app.use('/api/visitors', visitor);


module.exports = app