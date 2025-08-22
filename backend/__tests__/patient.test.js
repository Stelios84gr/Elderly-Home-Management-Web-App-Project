const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const patientService = require("../services/patient.service");

require("dotenv").config();

let token;

// avoid connecting before each test
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // login
    const res = await request(app)
        .post("/api/auth/login")
        .send({
        username: "3fcharles6",
        password: "mqvVNkT*8"
        });

    token = res.body.token;
});

// avoid disconnecting before each test
afterAll(async () => {
    await mongoose.connection.close();
});

// clean up mock POST documents
afterEach(async () => {
    await patientService.deleteByUsername("test0");
    await patientService.deleteByUsername("test2");
});

describe("Requests for /api/patients", () => {

    test('GET - Returns all patients', async () => {
        const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.length).toBeGreaterThan(0);
    }, 5000);

    test('POST - Create a patient', async () => {
        const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username":"test0",
            "firstName":"testFN0",
            "lastName":"testLN0",
            "AMKA":"01234567890",
            "dateOfBirth":"01-01-1970",
            "phoneNumber":6987654321,
            "authorizationToLeave": true,
            "roomData": {
                "roomNumber":"10",
                "bedNumber":"1010"
            },
            "patientAilments": {
                "disease":"testDisease0",
                "severity":2
            },
            "emergencyContactInfo": {
                "firstName":"eCFN0",
                "lastName":"eCLN0",
                "phoneNumber":6912312345,
                "address": {
                    "road":"testRoad0",
                    "number":50
                },
            "kinshipDegree": "testKD0"
            }, 
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBeTruthy();       
    }, 5000);

    test("POST - Creates a patient with a username that already exists", async() => {
        const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username":"test0",
            "firstName":"testFN1",
            "lastName":"testLN1",
            "AMKA":"01234567891",
            "dateOfBirth":"01-01-1971",
            "phoneNumber":6987654322,
            "authorizationToLeave": true,
            "roomData": {
                "roomNumber":"11",
                "bedNumber":"1111"
            },
            "patientAilments": {
                "disease":"testDisease1",
                "severity":3,
            },
            "emergencyContactInfo": {
                "firstName":"eCFN1",
                "lastName":"eCLN1",
                "phoneNumber":6912312346,
                "address": {
                    "road":"testRoad1",
                    " number":51
                },
                "kinshipDegree": "testKD1"
            },
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    });

    test("POST - Create a patient with empty firstName, patientAilments object and kinshipDegree", async() => {
    const res = await request(app)
    .post('/api/patients')
    .set('Authorization', `Bearer ${token}`)
    .send({
        "username":"test2",
        "firstName":"",
        "lastName":"testLN1",
        "AMKA":"01234567891",
        "dateOfBirth":"01-01-1972",
        "phoneNumber":6987654323,
        "authorizationToLeave": false,
        "roomData": {
            "roomNumber":"12",
            "bedNumber":"1212"
        },
        "patientAilments": {
            "disease":"",
            "severity":null,
        },
        "emergencyContactInfo": {
            "firstName":"eCFN1",
            "lastName":"eCLN1",
            "phoneNumber":6912312346,
            "address": {
                "road":"testRoad1",
                "number":51
            },
            "kinshipDegree": ""
        },
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).not.toBeTruthy();
    });
});

describe("Requests for /api/patients/:username", () => {

    test("GET - Returns patient by username", async () => {
        const result = await patientService.findOne();

        const res = await request(app)
        .get('/api/patients/' + result.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
    });

    test("PATCH - Updates patient data", async () => {
        const result = await patientService.findOne();

        // original values backup before updating
        const originalData = {
            firstName: result.firstName,
            lastName: result.lastName
        };

        try {
            const res = await request(app)
            .patch('/api/patients/' + result.username)
            .set('Authorization', `Bearer ${token}`)
            .send({
                "username": result.username,
                "firstName": "uFN",
                "lastName": "uLN",
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBeTruthy();
        } finally {
            // revert test changes
            await request(app)
            .patch('/api/patients/' + result.username)
            .set('Authorization', `Bearer ${token}`)
            .send(originalData);
        };
    });

    test("PATCH - Updates patient with empty fields", async() => {
        
        const result = await patientService.findOne();

        const res = await request(app)
        .patch('/api/patients/' + result.username)
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username": result.username,
            "dateOfBirth": "",
            "authorizationToLeave": null
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    });

    test("DELETE - Deletes a patient", async() => {

        // create test patient document to be deleted
        const testPatient = {
            username: "delete_me",
            firstName: "Del",
            lastName: "Ete",
            AMKA: "99999999999",
            dateOfBirth: "01-01-1980",
            phoneNumber: 6911112222,
            authorizationToLeave: true,
            roomData: { roomNumber: "99", bedNumber: "9999" },
            patientAilments: { disease: "Cardiovascular", severity: 1 },
            emergencyContactInfo: {
                firstName: "Contact",
                lastName: "Person",
                phoneNumber: 6911111112,
                address: { road: "testRoad", number: 1 }
            },
            kinshipDegree: "Friend"
        };

        await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(testPatient);

        const res = await request(app)
        .delete('/api/patients/' + testPatient.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    });

    test("DELETE - Try to delete a non-existent patient", async() => {

        const res = await request(app)
        .delete('/api/patients/nonExistentPatientUsername')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).not.toBeTruthy();
    });
});