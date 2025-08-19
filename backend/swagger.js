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
    "security": [
        { "bearerAuth": [] }
    ],
    "openapi":"3.1.1",
    "info": {
        "version": "1.0.0",
        "title": "Elderly Home Management Web App",
        "description": "An application for managing patients and their visitors, as well as the staff of an elderly home.",
        "contact": {
            "name": "Stelios Fridakis",
            "url": "https://github.com/Stelios84gr/Elderly-Home-Management-Web-App-Project/",
            "email": "stelios.fridakis@hotmail.com"
        }
    },
    "servers": [
        {
            url: "http://localhost:3000",
            description: "Local Server"
        },
        {

        }
    ],
    "tags": [
        {
            "name": "Patients",
            "description": "Endpoints for Patients."
        },
        {
            "name": "Visitors",
            "description": "Endpoints for Visitors."
        },
        {
            "name": "Staff",
            "description": "Endpoints for Staff members."
        },
        {
            "name": "Auth",
            "description": "Endpoint for Authentication."
        }
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
                "tags": ["Patients"],
                "description": "Data of patient to be created.",
                "requestBody": {
                    "description": "Data of patient to be created.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": { "type": "string" },
                                    "firstName": { "type": "string" },
                                    "lastName": { "type": "string" },
                                    "AMKA": { "type": "string" },
                                    "dateOfBirth": { "type": "string", "format": "date" },
                                    "phoneNumber": { "type": "number" },
                                    "authorizationToLeave": { "type": "boolean" },
                                    "roomData": {
                                        "type": "object",
                                        "properties": {
                                            "roomNumber": { "type": "string" },
                                            "bedNumber": { "type": "string" }
                                        },
                                        "required": ["roomNumber", "bedNumber"]
                                    },
                                    "patientAilments": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "disease": { "type": "string" },
                                                "severity": { "type": "number" }
                                            },
                                            "required": ["disease", "severity"]
                                        }
                                    },
                                    "emergencyContactInfo": {
                                        "type": "object",
                                        "properties": {
                                            "firstName": { "type": "string" },
                                            "lastName": { "type": "string" },
                                            "phoneNumber": { "type": "number" },
                                            "address": {
                                                "type": "object",
                                                "properties": {
                                                    "road": { "type": "string" },
                                                    "number": { "type": "string" }
                                                },
                                                "required": ["road", "number"]
                                            }
                                        },
                                        "required": ["firstName", "lastName", "phoneNumber", "address"]
                                    },
                                    "kinshipDegree": { "type": "string" },
                                    "visitors": { "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "relationship": { "type": "string" }
                                            }
                                        }
                                    }
                                },
                                "required": ["username", "firstName", "lastName", "AMKA", "dateOfBirth", "phoneNumber", "authorizationToLeave", "roomData", "patientAilments", "emergencyContactInfo"]
                            }
                        }
                    }
                },
            },
        },
        "/api/patients/{patient}": {
            "get": {
                "tags": ["Patients"],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of the specific patient we want to find.",
                        "schema": {
                        "type": "string"
                        }
                    }
                ],
                "description": "Returns details for a specific patient.",
                "responses": {
                    "200": {
                        "description": "Patient details.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Patient"
                                }
                            }
                        }
                    }
                }
            },
            "patch": {
                "tags": ["Patients"],
                "description": "Updates specific patient data.",
                "parameters": [
                    {
                        "name":"username",
                        "in":"path",
                        "required":true,
                        "description": "Username of patient to be updated.",
                        "type":"string"
                    }
                ],
                "requestBody": {
                    "description":"Data of patient to be updated. 'schema': because in the update method of the patient controller I use {$set: req.body}",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                // because in the update method of the patient controller I use {$set: req.body}
                                "$ref": "#/components/schemas/Patient"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Patient updated."
                    },
                    "400": {
                        "description": "Provides error information regarding patient data update failure."
                    }
                }
            },
            "delete": {
                "tags": ["Patients"],
                "description": "Deletes patient from the database.",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "description": "Username of patient to be deleted.",
                        "type": "string",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Patient deleted."
                    }
                }
            }
        },
        // "User" is used in the "login" context here, not referring to a specific collection
        "/api/auth/login": {
            "post": {
                "tags": ["Auth"],
                "description": "User Login",
                "requestBody": {
                    "description": "Staff member provides username and passwords and receives a JWT in the response.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": { "type": "string" },
                                    "password": { "type": "string" }
                                },
                                "required": ["username", "password"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "JWT is successfully returned."
                    },
                    "404": {
                        "description": "User is not found."
                    },
                    "401": {
                        "description": "Provided credentials are invalid."
                    },
                    "400": {
                        "description": "Provides error information regarding user login failure."
                    }
                }
            }
        }
    }
}