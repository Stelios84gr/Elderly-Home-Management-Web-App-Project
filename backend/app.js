const express = require("express");
const app = express();

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const patient = require('./routes/patient.routes');
const visitor = require( './routes/visitor.routes');
const staff = require('./routes/staff.routes');
const auth = require('./routes/auth.routes');

app.use('/api/auth', auth)
app.use('/api/patients', patient);
app.use('/api/staff', staff);
app.use('/api/visitors', visitor);

app.use(
    '/api-docs/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument.options)
);

module.exports = app