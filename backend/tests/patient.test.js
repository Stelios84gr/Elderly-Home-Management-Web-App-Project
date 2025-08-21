const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../app');

require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe("Requests for /api/patients", () => {

    let token;

    beforeAll(() => {
        user = {
            username: "3fcharles6",
            roles: ["READER", "EDITOR", "ADMIN"]
        };
    });

    test('GET - Returns all patients', async () => {
        const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy;
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
                "severity":2,
            },
            "emergencyContactInfo": {
                "firstName":"eCFN0",
                "lastName":"eCLN0",
                "phoneNumber":6912312345,
                "address": {
                    "road":"testRoad0",
                    " number":50
                },
            },
            "kinshipDegree": "testKD0"
        });

        expect(res.statusCode).toBe(200);
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
            },
            "kinshipDegree": "testKD1"
        });
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
        },
        "kinshipDegree": ""
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).not.toBeTruthy();
    });
});

describe("Requests for /api//:username", () => {
    beforeAll(()=>{
        // δημιουργία test token με χρήση mock secret
        user= {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
});

it("GET - Returns specific user", async()=>{

    const result = await userService.findLastInsertedUser();

    const res = await request(app)
    .get('/api/patients/' + result.username)
    // αποστολή test token με headers
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.username).toBe(result.username);
    expect(res.body.data.email).toBe(result.email);
});

it("PATCH - Update patient data", async() => {
    
    const result = await patientService.findOne();

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
});

it("DELETE - Delete a patient", async() => {

    const result = await patientService.findOne();

    const res = await request(app)
    .delete('/api/patients/' + result.username)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
})
});