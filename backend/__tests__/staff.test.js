const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const staffService = require("../services/staff.service");

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
    // check that the staff member doesn't already exist
    const existingStaffMember = await staffService.findOne("test0");

    if (!existingStaffMember) {
        await staffService.create({
            username: "test0",
            password: "p4Sw0rd!0",
            firstName: "testFN0",
            lastName: "testLN0",
            AMKA: "00112233456",
            phoneNumber: 6987654321,
            address: {
            road: "testRoad0",
            number: 50
            },
            occupation: "Nurse",
            roles: ["READER"],
            startDate: "2018-09-10 08:00:00",
            monthlySalary: 1020
        });
    };
});

// clean up mock POST documents
afterEach(async () => {
    await staffService.deleteByUsername("test0");
    await staffService.deleteByUsername("test2");
    await staffService.deleteByUsername("test3");
    await staffService.deleteByUsername("deleteMe");  // in case DELETE test fails
});

describe("Requests for /api/staff", () => {

    test("GET - Returns all staff members", async () => {
    const res = await request(app)
        .get("/api/staff")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    }, 5000);    

    test("POST - Creates a staff member", async () => {
    const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "username": "test3",
            "password": "p4Sw0rd!3",
            "firstName": "sFN",
            "lastName": "sLN",
            "TIN": "123456789",
            "phoneNumber": 6912345678,
            "occupation": "Nurse",
            "monthlySalary": 1200,
            "address": {
                "road": "Main",
                "number": 10
            }
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBeTruthy();
    });

    test("POST - Creates staff member with a username that already exists", async () => {
    const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "username": "test0",
            "password": "p4Sw0rd!1",
            "firstName": "rFN",
            "lastName": "rLN",
            "TIN": "123456782",
            "phoneNumber": 6912345677,
            "occupation": "Nurse",
            "monthlySalary": 1100,
            "address": {
                "road": "Orchard",
                "number": 8
            },
            "roles": ["READER"],
            "startDate": "2019-05-20 08:00:00",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);

    test("POST - Create staff with empty firstName, TIN and occupation", async () => {
    const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${token}`)
        .send({
        "username": "test2",
        "password": "p4Sw0rd!2",
        "firstName": "",
        "lastName": "sLN2",
        "TIN": "",
        "phoneNumber": 6923456789,
        "occupation": "",
        "monthlySalary": 1300,
        "address": {
            "road": "Second",
            "number": 22
        },
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);
});

describe("/api/staff/:username", () => {

    test("GET - Returns staff member by username", async () => {
        const result = await staffService.findOne("test0");

        const res = await request(app)
            .get("/api/staff/" + result.username)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
    }, 5000);

    test("PATCH - Updates staff member data", async () => {
        const result = await staffService.findOne("test0");

        // original values backup before updating
        const originalData = {
            firstName: result.firstName,
            lastName: result.lastName
        };

        try {
        const res = await request(app)
            .patch("/api/staff/" + result.username)
            .set("Authorization", `Bearer ${token}`)
            .send({
                "username": result.username,
                "firstName": "uSFN",
                "lastName": "uSLN"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        } finally {
            // revert test changes
            await request(app)
            .patch('/api/staff/' + result.username)
            .set('Authorization', `Bearer ${token}`)
            .send(originalData);
        };
    }, 5000);

    test("PATCH - Updates staff member with empty fields", async () => {
        const result = await staffService.findOne("test0");

        const res = await request(app)
        .patch("/api/staff/" + result.username)
        .set("Authorization", `Bearer ${token}`)
        .send({
        "username": result.username,
        "TIN": "",
        "phoneNumber": ""
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 5000);

    test("DELETE - Deletes staff member by username", async () => {

    // create test staff document to be deleted
        const testStaffMember = {
            username: "deleteMe",
            password: "S0m3th1ng!",
            firstName: "Del",
            lastName: "Ete",
            TIN: "909090909",
            phoneNumber: 6911112222,
            address: { road: "testRoad", number: 1 },
            occupation: "Doctor",
            roles: ["READER", "EDITOR"],
            startDate: "2020-9-01 08:00:00",
            monthlySalary: 1300
            };

        await request(app)
        .post('/api/staff')
        .set('Authorization', `Bearer ${token}`)
        .send(testStaffMember);

        const res = await request(app)
        .delete("/api/staff/" + testStaffMember.username)
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 5000);

    test("DELETE - Try to delete non-existent staff member", async () => {

        const res = await request(app)
        .delete("/api/staff/nonExistentStaffMemberUsername")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).not.toBeTruthy();
    });
}, 5000);
