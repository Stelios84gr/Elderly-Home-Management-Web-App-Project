const mongoose = require('mongoose');
const schema = mongoose.Schema;
const m2s = require('mongoose-to-swagger');
const Patient = require('./models/patient.model');
const Staff = require('./models/staff.model');
const Visitor = require('./models/visitor.model');

exports.options = {
    "components": {
        "schemas": {
            Patient: m2s(Patient),
            Visitor: m2s(Visitor),
            Staff: m2s(Staff)
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
    "security": {
        "bearerAuth":[]
    },
    "openapi":"3.1.1",
    "info": {
        "version": "1.0.0",
        "title": "Elderly Home Management Web App",
        "description": "An application for managing patients and their visitors, as well as the staff of an elderly home.",
        "contact": {
            "name": "Stelios Fridakis",
            "URL": "https://github.com/Stelios84gr/Elderly-Home-Management-Web-App-Project/",
            "e-mail": "stelios.fridakis@hotmail.com"
        }
    },
    "servers": [
        {
            url: "httop://localhost:3000",
            description: "Local Server"
        },
        {

        }
    ],
    "tags": [
        {
            "name": "Patients",
            "descriptions": "Endpoints for Patients."
        },
        {
            "name": "Visitors",
            "descriptions": "Endpoints for Visitors."
        },
        {
            "name": "Staff",
            "descriptions": "Endpoints for Staff members."
        },
    ],
    "paths": {
        "/api/patients": {
            "get": {
                "tags": ["Patients"],
                "description": "Returns a list of all patients.",
                "responses": {
                    "200": {
                        "description": "List of all patients.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Patient"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": 
            },
            "patch": {

            },
            "delete": {

            }
        },
        "api/users/{patient}": {
            "get": {
                "tags": ["Patients"],
                "parameters": [
                    {
                        "name": ""
                    }
                ]
            }
        }
    }
}