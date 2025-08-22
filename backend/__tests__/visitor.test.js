const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const visitorService = require("../services/visitor.service");

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

// create mock visitor
beforeEach(async () => {
    // check that the visitor doesn't already exist
    const existingVisitor = await visitorService.findOne("test0");

    if (!existingVisitor) {
        await visitorService.create({
            username: "test0",
            firstName: "testFN0",
            lastName: "testLN0",
            phoneNumber: 6987654321,
            address: {
                road: "testRoad0",
                number: 50
            },
            relationship: "kinsperson",
            isFamily: true
        });
    };
});

// clean up mock POST documents
afterEach(async () => {
    await visitorService.deleteByUsername("test0");
    await visitorService.deleteByUsername("test2");
    await visitorService.deleteByUsername("test3");
    await visitorService.deleteByUsername("deleteMe");  // in case DELETE test fails
    
});

describe("Requests for /api/visitors", () => {

    test('GET - Returns all visitors', async () => {
        const res = await request(app)
        .get('/api/visitors')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.length).toBeGreaterThan(0);
    }, 5000);

    test('POST - Create a visitor', async () => {
        const res = await request(app)
        .post('/api/visitors')
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username":"test3",
            "firstName":"testFN3",
            "lastName":"testLN3",
            "phoneNumber":6987654322,
            "address": {
                "road":"testRoad3",
                "number":50
            },
            "relationship": "kinsperson",
            "isFamily": true
            });
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBeTruthy();       
    }, 5000);

    test("POST - Creates a visitor with a username that already exists", async() => {
        const res = await request(app)
        .post('/api/visitors')
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username":"test0",
            "firstName":"testFN3",
            "lastName":"testLN3",
            "phoneNumber":6987654333,
            "address": {
                "road":"testRoad3",
                "number":50
            },
            "relationship": "kinsperson",
            "isFamily": true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);

    test("POST - Create a visitor with empty lastName, phoneNumber and isFamily", async() => {
    const res = await request(app)
    .post('/api/visitors')
    .set('Authorization', `Bearer ${token}`)
    .send({
            "username":"test2",
            "firstName":"testFN2",
            "lastName":"",
            "phoneNumber":null,
            "address": {
                "road":"testRoad2",
                "number":50
            },
            "relationship": "kinsperson",
            "isFamily": null
            });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).not.toBeTruthy();
    }, 5000);

describe("Requests for /api/visitors/:username", () => {

    test("GET - Returns visitor by username", async () => {
        const result = await visitorService.findOne("test0");

        const res = await request(app)
        .get('/api/visitors/' + result.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
    }, 5000);

    test("PATCH - Updates visitor data", async () => {
        const result = await visitorService.findOne("test0");

        // original values backup before updating
        const originalData = {
            firstName: result.firstName,
            lastName: result.lastName
        };

        try {
            const res = await request(app)
            .patch('/api/visitors/' + result.username)
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
            .patch('/api/visitors/' + result.username)
            .set('Authorization', `Bearer ${token}`)
            .send(originalData);
        };
    }, 5000);

    test("PATCH - Updates visitor with empty fields", async() => {
        
        const result = await visitorService.findOne("test0");

        const res = await request(app)
        .patch('/api/visitors/' + result.username)
        .set('Authorization', `Bearer ${token}`)
        .send({
            "username": result.username,
            "phoneNumber": "",
            "relationship": ""
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);

    test("DELETE - Deletes a visitor", async() => {

        // create test visitor document to be deleted
        const testVisitor = {
            "username":"deleteMe",
            "firstName":"delete",
            "lastName":"me",
            "phoneNumber":6968676664,
            "address": {
                "road":"deleteRoad",
                "number":42
            },
            "relationship": "kinsperson",
            "isFamily": false
        };

        await request(app)
        .post('/api/visitors')
        .set('Authorization', `Bearer ${token}`)
        .send(testVisitor);

        const res = await request(app)
        .delete('/api/visitors/' + testVisitor.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 5000);

    test("DELETE - Try to delete a non-existent visitor", async() => {

        const res = await request(app)
        .delete('/api/visitors/nonExistentVisitorUsername')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);
});