"use strict";

const request = require("supertest");
const app = require("../app");
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token
} = require("../models/testUtils.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /emotions/", function () {
	test("works for correct user", async function () {
		const userId = 1;
		const emotionsRequest = {
			id: 1,
			userId: userId,
			entryText: "I felt very happy today because I spent time with my family."
		};
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send(emotionsRequest)
			.set("authorization", `Bearer ${u1Token}`);
		console.log(resp.body.emotions.emotion.document.emotion);
		expect(resp.body).toEqual({
			emotions: expect.any(Object) // Assuming the response is an object containing emotion data.
		});
		expect(resp.body.emotions.emotion.document.emotion).toBeDefined();
		expect(resp.body.emotions.emotion.document.emotion.joy).toEqual(expect.any(Number));
	}, 20000);

	test("bad request with missing userId", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send({
				entryText: "I felt very happy today because I spent time with my family."
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("404 with missing userId in route", async function () {
		const resp = await request(app)
			.post(`/emotions`)
			.send({
				userId: 1,
				entryText: "I felt very happy today because I spent time with my family."
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(404);
	});

	test("bad request with missing data", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send({
				userId: userId
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with invalid data", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send({
				userId: userId,
				entryText: 12345 // Sending a number instead of a string for entryText
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("unauth for anon", async function () {
		const userId = 1;
		const resp = await request(app).post(`/emotions/${userId}`).send({
			userId: userId,
			entryText: "I felt very happy today because I spent time with my family."
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth if userId doesn't match the user id of the user who has the provided token", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send({
				userId: userId,
				entryText: "I felt very happy today because I spent time with my family."
			})
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth if the userId doesn't match any user_id", async function () {
		const userId = 101; // Assuming 101 is not a valid user id in the test database.
		const resp = await request(app)
			.post(`/emotions/${userId}`)
			.send({
				userId: userId,
				entryText: "I felt very happy today because I spent time with my family."
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
});
