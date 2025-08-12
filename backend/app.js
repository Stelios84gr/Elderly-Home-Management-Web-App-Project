const express = require("express");
const app = express();

const patient = require('./routes/patient.routes');
const visitor = require( './routes/visitor.routes');
const staff = require('./routes/staff.routes');

module.exports = app