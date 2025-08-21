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

// clean up mock POST documents
afterEach(async () => {
    await staffService.deleteByUsername("test0");
    await staffService.deleteByUsername("test2");
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

    test("POST - Creates staff member", async () => {
    const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${token}`)
        .send({
        "username": "staffTest1",
        "password": "Password123",
        "firstName": "sFN",
        "lastName": "sLN",
        "TIN": "123456789",
        "phoneNumber": "6912345678",
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
            "username": "staffTest1",
            "password": "Password124",
            "firstName": "rFN",
            "lastName": "rLN",
            "TIN": "123456782",
            "phoneNumber": "6912345677",
            "occupation": "Nurse",
            "monthlySalary": 1100,
            "address": {
                "road": "Orchard",
                "number": 8
            }
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    });

    test("POST - Create staff with empty firstName, TIN and occupation", async () => {
    const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${token}`)
        .send({
        "username": "staffTest2",
        "password": "Password123",
        "firstName": "",
        "lastName": "sLN2",
        "TIN": "",
        "phoneNumber": "6923456789",
        "occupation": "",
        "monthlySalary": 1300,
        "address": {
            "road": "Second",
            "number": 22
        }
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    });
});

describe("/api/staff/:username", () => {

    test("GET - Returns staff member by username", async () => {
        const result = await staffService.findOne();

        const res = await request(app)
            .get("/api/staff/" + result.username)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
    });

    test("PATCH - Updates staff member data", async () => {
        const result = await staffService.findOne();

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
    });

    test("PATCH - Updates staff member with empty fields", async () => {
    const result = await staffService.findOne();

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
    });

    test("DELETE - Deletes staff member by username", async () => {

    // create test staff document to be deleted
        const testStaffMember = {
            username: "delete_me",
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
    });

    test("DELETE - Try to delete non-existent staff member", async () => {

        const res = await request(app)
        .delete("/api/staff/nonExistentStaffMemberUsername")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).not.toBeTruthy();
    });
});
