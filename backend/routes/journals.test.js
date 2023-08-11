"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const Journal = require("../models/journal");

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

/************************************** GET /journals/:id */

// describe("GET /journals/:journalId", function () {
// 	// Since Journal Ids are serialized starting from 1, you can directly use them.

// 	test("works for correct user", async function () {
// 		const resp = await request(app).get(`/users/1/journals/1`).set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({
// 			journal: {
// 				id: 1,
// 				user_id: 1,
// 				title: "My birthday",
// 				entry_text: "Today was my birthday and I had a great day.",
// 				entry_date: "2022-01-04",
// 				emotions: null // Since emotions were not provided in the mock data
// 			}
// 		});
// 	});

// 	test("unauth for other users", async function () {
// 		const resp = await request(app).get(`/users/1/journals/1`).set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app).get(`/users/1/journals/1`);

// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found if journal not found", async function () {
// 		const resp = await request(app).get(`/users/1/journals/101`).set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });

// describe("GET /journals/:entryDate", function () {
// 	test("works for correct user and date", async function () {
// 		const resp = await request(app)
// 			.get(`/users/1/journals/date/2022-01-04`)
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({
// 			journal: {
// 				id: 1,
// 				user_id: 1,
// 				title: "My birthday",
// 				entry_text: "Today was my birthday and I had a great day.",
// 				entry_date: "2022-01-04",
// 				emotions: null
// 			}
// 		});
// 	});

// 	test("unauth for other users", async function () {
// 		const resp = await request(app)
// 			.get(`/users/1/journals/date/2022-01-04`)
// 			.set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app).get(`/users/1/journals/date/2022-01-04`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found if journal not found for the given date", async function () {
// 		const resp = await request(app)
// 			.get(`/users/1/journals/date/2025-01-04`)
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });

describe("POST /journals/", function () {
	test("works for correct user", async function () {
		const newEntry = {
			userId: 1,
			title: "New Title",
			entry: "New Entry Text",
			entryDate: "2025-01-05"
		};
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send(newEntry)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			journal: {
				id: expect.any(Number),
				user_id: 1,
				title: "New Title",
				entry_text: "New Entry Text",
				entry_date: "2025-01-05",
				emotions: null
			}
		});
	});

	test("bad request with missing userId", async function () {
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send({
				title: "New Title",
				entry: "New Entry Text",
				entryDate: "2025-01-05"
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with missing data", async function () {
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send({
				userId: 1,
				title: "New Title"
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with invalid data", async function () {
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send({
				userId: 1,
				title: "New Title",
				entry: "New Entry Text",
				entryDate: 2025
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).post(`/users/1/journals`).send({
			userId: 1,
			title: "New Title",
			entry: "New Entry Text",
			entryDate: "2025-01-05"
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth if userId doesn't match the user id of the user who has the provided token", async function () {
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send({
				userId: 1,
				title: "New Title",
				entry: "New Entry Text",
				entryDate: "2025-01-05"
			})
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("not found if the userId doesn't match any user_id", async function () {
		const resp = await request(app)
			.post(`/users/1/journals`)
			.send({
				userId: 101,
				title: "New Title",
				entry: "New Entry Text",
				entryDate: "2025-01-05"
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** DELETE /journals/:username */

// describe("DELETE /journals/:username", function () {
// 	test("works for admin", async function () {
// 		const resp = await request(app).delete(`/journals/u1`).set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.body).toEqual({ deleted: "u1" });
// 	});

// 	test("works for same user", async function () {
// 		const resp = await request(app).delete(`/journals/u1`).set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({ deleted: "u1" });
// 	});

// 	test("unauth if not same user", async function () {
// 		const resp = await request(app).delete(`/journals/u1`).set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app).delete(`/journals/u1`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found if user missing", async function () {
// 		const resp = await request(app).delete(`/journals/nope`).set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });

/************************************** POST /journals/:username/jobs/:id */

// describe("POST /journals/:username/jobs/:id", function () {
// 	test("works for admin", async function () {
// 		const resp = await request(app)
// 			.post(`/journals/u1/jobs/${testJobIds[1]}`)
// 			.set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.body).toEqual({ applied: testJobIds[1] });
// 	});

// 	test("works for same user", async function () {
// 		const resp = await request(app)
// 			.post(`/journals/u1/jobs/${testJobIds[1]}`)
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({ applied: testJobIds[1] });
// 	});

// 	test("unauth for others", async function () {
// 		const resp = await request(app)
// 			.post(`/journals/u1/jobs/${testJobIds[1]}`)
// 			.set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app).post(`/journals/u1/jobs/${testJobIds[1]}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found for no such username", async function () {
// 		const resp = await request(app)
// 			.post(`/journals/nope/jobs/${testJobIds[1]}`)
// 			.set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});

// 	test("not found for no such job", async function () {
// 		const resp = await request(app).post(`/journals/u1/jobs/0`).set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});

// 	test("bad request invalid job id", async function () {
// 		const resp = await request(app).post(`/journals/u1/jobs/0`).set("authorization", `Bearer ${adminToken}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });
