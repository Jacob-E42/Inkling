"use strict";

const request = require("supertest");
const app = require("../app");
const getCurrentDate = require("../helpers/getCurrentDate");
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	u3Token,
	nonUserToken
} = require("../models/testUtils.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /feedback/", function () {
	test("works for correct user", async function () {
		const userId = 1;
		const feedbackRequest = {
			id: 1,
			userId: 1,
			title: "My first entry",
			entryText: "New Entry Text for Feedback",
			journalType: "Gratitude Journal"
		};
		const resp = await request(app)
			.post(`/feedback/${userId}`)
			.send(feedbackRequest)
			.set("authorization", `Bearer ${u1Token}`);

		expect(resp.body).toEqual({
			feedback: expect.any(String)
		});
		expect(resp.body.feedback.length).toBeGreaterThan(500);
	}, 20000);

	test("bad request with missing userId", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/feedback/${userId}`)
			.send({
				entryText: "New Entry Text for Feedback",
				journalType: "Gratitude Journal"
			})
			.set("authorization", `Bearer ${u1Token}`);
		console.log(resp.body);
		expect(resp.statusCode).toEqual(400);
	}, 15000);

	test("404 with missing userId in route", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/feedback`)
			.send({
				entryText: "New Entry Text for Feedback",
				journalType: "Gratitude Journal"
			})
			.set("authorization", `Bearer ${u1Token}`);
		console.log(resp.body);
		expect(resp.statusCode).toEqual(404);
	}, 15000);

	test("bad request with missing data", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/feedback/${userId}`)
			.send({
				userId: 1,
				entryText: "New Entry Text for Feedback"
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with invalid data", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/feedback/${userId}`)
			.send({
				id: 1,
				userId: 1,
				entryText: 12345, // sending a number instead of a string for entryText
				journalType: "Gratitude Journal"
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("unauth for anon", async function () {
		const userId = 1;
		const resp = await request(app).post(`/feedback/${userId}`).send({
			id: 1,
			userId: 1,
			entryText: "New Entry Text for Feedback",
			journalType: "Gratitude Journal"
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth if userId doesn't match the user id of the user who has the provided token", async function () {
		const userId = 1;
		const resp = await request(app)
			.post(`/feedback/${userId}`)
			.send({
				id: 1,
				userId: 1,
				entryText: "New Entry Text for Feedback",
				journalType: "Gratitude Journal"
			})
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	// test("not found if the userId doesn't match any user_id", async function () {
	// 	const userId = 101;
	// 	const resp = await request(app)
	// 		.post(`/feedback/${userId}`)
	// 		.send({
	// 			id: 1,
	// 			userId: 101,
	// 			entryText: "New Entry Text for Feedback",
	// 			journalType: "Gratitude Journal"
	// 		})
	// 		.set("authorization", `Bearer ${u1Token}`);
	// 	expect(resp.statusCode).toEqual(404); // This assumes that you will return a 404 if the userId isn't found, adjust accordingly.
	// });
});
