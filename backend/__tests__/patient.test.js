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

beforeEach(async () => {
    // check that the patient doesn't already exist
    const existingPatient = await patientService.findOne("test0");

    if (!existingPatient) {
        await patientService.create({
            username: "test0",
            firstName: "testFN0",
            lastName: "testLN0",
            AMKA: "00112233445",
            dateOfBirth: "05-01-1940",
            phoneNumber: 6987654321,
            authorizationToLeave: false,
            roomData: {
                roomNumber: "10",
                bedNumber: "1010"
            },
            patientAilments: {
                disease: "testDisease0",
                severity: 2
            },
            emergencyContactInfo: {
                firstName: "testECIFN0",
                lastName: "testECILN0",
                phoneNumber: 6960696069,
                address: {
                road: "testRoad0",
                number: 50
                },
                kinshipDegree: "friend"
            }
        });
    };
});

// clean up mock POST documents
afterEach(async () => {
    await patientService.deleteByUsername("test0");
    await patientService.deleteByUsername("test2");
    await patientService.deleteByUsername("test3");
    await visitorService.deleteByUsername("deleteMe");  // in case DELETE test fails
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
            "username":"test3",
            "firstName":"testFN3",
            "lastName":"testLN3",
            "AMKA":"01234567898",
            "dateOfBirth":"01-01-1950",
            "phoneNumber":6987654345,
            "authorizationToLeave": true,
            "roomData": {
                "roomNumber":"13",
                "bedNumber":"1313"
            },
            "patientAilments": {
                "disease":"testDisease3",
                "severity":2
            },
            "emergencyContactInfo": {
                "firstName":"eCIFN3",
                "lastName":"eCILN3",
                "phoneNumber":6912312321,
                "address": {
                    "road":"testRoad3",
                    "number":50
                },
            "kinshipDegree": "brother"
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
            "AMKA":"01234567899",
            "dateOfBirth":"01-01-1942",
            "phoneNumber":6988664322,
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
                "firstName":"eCIFN1",
                "lastName":"eCILN1",
                "phoneNumber":6912312346,
                "address": {
                    "road":"testRoad1",
                    "number":51
                },
                "kinshipDegree": "testKD1"
            },
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);

    test("POST - Create a patient with empty firstName, authorizationToLeave and kinshipDegree", async() => {
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
        "authorizationToLeave": null,
        "roomData": {
            "roomNumber":"12",
            "bedNumber":"1212"
        },
        "patientAilments": {
            "disease":"Dementia",
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
}, 5000);

describe("Requests for /api/patients/:username", () => {

    test("GET - Returns patient by username", async () => {
        const result = await patientService.findOne("test0");

        const res = await request(app)
        .get('/api/patients/' + result.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
    }, 5000);

    test("PATCH - Updates patient data", async () => {
        const result = await patientService.findOne("test0");

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
    }, 5000);

    test("PATCH - Updates patient with empty fields", async() => {
        
        const result = await patientService.findOne("test0");

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
    }, 5000);

    test("DELETE - Deletes a patient", async() => {

        // create test patient document to be deleted
        const testPatient = {
            username: "deleteMe",
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
                address: { road: "testRoad", number: 1 },
                kinshipDegree: "Friend"
            }
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
    }, 5000);

    test("DELETE - Try to delete a non-existent patient", async() => {

        const res = await request(app)
        .delete('/api/patients/nonExistentPatientUsername')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).not.toBeTruthy();
    });
}, 5000);