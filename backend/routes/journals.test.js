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

/************************************** GET /journals/:id */

describe("GET /journals/:journalId", function () {
	// Since Journal Ids are serialized starting from 1, you can directly use them.

	test("works for correct user", async function () {
		const resp = await request(app).get(`/users/1/journals/1`).set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			journal: {
				id: 1,
				userId: 1,
				title: "My birthday",
				entryText: "Today was my birthday and I had a great day.",
				entryDate: "2022-01-04",
				emotions: null, // Since emotions were not provided in the mock data
				journalType: "Gratitude Journal"
			}
		});
	});

	test("unauth for other users", async function () {
		const resp = await request(app).get(`/users/1/journals/1`).set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).get(`/users/1/journals/1`);

		expect(resp.statusCode).toEqual(401);
	});

	test("not found if journal not found", async function () {
		const resp = await request(app).get(`/users/1/journals/101`).set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** GET /journals/date/:entryDate */

describe("GET /journals/:entryDate", function () {
	test("works for correct user and date", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2022-01-04`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			journal: {
				id: 1,
				userId: 1,
				title: "My birthday",
				entryText: "Today was my birthday and I had a great day.",
				entryDate: "2022-01-04",
				emotions: null,
				journalType: "Gratitude Journal"
			}
		});
	});

	test("unauth for other users", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2022-01-04`)
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).get(`/users/1/journals/date/2022-01-04`);
		expect(resp.statusCode).toEqual(401);
	});

	test("not found if journal not found for the given date", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2025-01-04`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(404);
		expect(resp.text).not.toContain("You need to create a new entry");
	});

	test("returns new journal entry if not found, but date is today", async function () {
		const currentDate = getCurrentDate();
		const resp = await request(app)
			.get(`/users/1/journals/date/${currentDate}`)
			.set("authorization", `Bearer ${u1Token}`);

		expect(resp.statusCode).toEqual(200);
		// console.debug(resp);
		expect(resp.text).toContain(`Journal Entry: ${currentDate}`);
		// expect(resp.text).toContain(`entryDate: ${currentDate}`);
	});
});

/****************************************GET /journals/entryDate/quickCheck */
describe("GET /journals/:entryDate/quickCheck", function () {
	test("works for correct user and date", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2022-01-04/quickCheck`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual(true);
		expect(resp.statusCode).toEqual(200);
	});

	test("unauth for other users", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2022-01-04/quickCheck`)
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).get(`/users/1/journals/date/2022-01-04/quickCheck`);
		expect(resp.statusCode).toEqual(401);
	});

	test("returns false if journal not found for the given date", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/date/2025-01-04/quickCheck`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(200);
		expect(resp.body).toEqual(false);
	});
});

/****************************************GET /journals/date/dateRange/quickCheck */
describe("GET /journals/date/dateRange/quickCheck", function () {
	const dateRange = ["2022-01-04", "2022-01-05", "2022-01-06"];
	test("works for correct user and date", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/dateRange/quickCheck`)
			.send({ dateRange })
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body.areJournalEntries).toEqual([
			{ date: "2022-01-04", isJournal: true },
			{ date: "2022-01-05", isJournal: false },
			{ date: "2022-01-06", isJournal: false }
		]);
		expect(resp.statusCode).toEqual(200);
	});

	test("unauth for other users", async function () {
		const resp = await request(app)
			.get(`/users/1/journals/dateRange/quickCheck`)
			.send({ dateRange })
			.set("authorization", `Bearer ${u2Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).get(`/users/1/journals/dateRange/quickCheck`).send({ dateRange });
		expect(resp.statusCode).toEqual(401);
	});
});

/************************************** POST /journals/ */

// describe("POST /journals/", function () {
// 	test("works for correct user", async function () {
// 		const newEntry = {
// 			userId: 1,
// 			title: "New Title",
// 			entryText: "New Entry Text",
// 			entryDate: "2025-01-05",
// 			journalType: "Gratitude Journal"
// 		};
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send(newEntry)
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({
// 			journal: {
// 				id: expect.any(Number),
// 				userId: 1,
// 				title: "New Title",
// 				entryText: "New Entry Text",
// 				entryDate: "2025-01-05",
// 				journalType: "Gratitude Journal"
// 			}
// 		});
// 	});

// 	test("bad request with missing userId", async function () {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				title: "New Title",
// 				entry: "New Entry Text",
// 				entryDate: "2025-01-05"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 	});

// 	test("bad request with missing data", async function () {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				userId: 1,
// 				title: "New Title"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 	});

// 	test("bad request with invalid data", async function () {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				userId: 1,
// 				title: "New Title",
// 				entry: "New Entry Text",
// 				entryDate: 2025
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 	});

// 	test("BadRequestError if Journal with the same date already exists", async () => {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				user_id: 1,
// 				title: "Surprise Visit",
// 				entryText: "Out of nowhere, my uncle and aunt came over to my house today.",
// 				entryDate: "2022-01-04"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app).post(`/users/1/journals`).send({
// 			userId: 1,
// 			title: "New Title",
// 			entry: "New Entry Text",
// 			entryDate: "2025-01-05"
// 		});
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth if userId doesn't match the user id of the user who has the provided token", async function () {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				userId: 1,
// 				title: "New Title",
// 				entryText: "New Entry Text",
// 				entryDate: "2025-01-05"
// 			})
// 			.set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found if the userId doesn't match any user_id", async function () {
// 		const resp = await request(app)
// 			.post(`/users/1/journals`)
// 			.send({
// 				userId: 101,
// 				title: "New Title",
// 				entryText: "New Entry Text",
// 				entryDate: "2025-01-05",
// 				journalType: "Gratitude Journal"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });

// /************************************** PATCH /journals/date/:entryDate */
// describe("PATCH /journals/date/:entryDate", function () {
// 	test("works for correct user", async function () {
// 		const updateData = {
// 			userId: 1,
// 			title: "Updated Title",
// 			entryText: "Updated Entry Text",
// 			emotions: { joy: 0.4, sad: 0.7 },
// 			journalType: "Daily Journal"
// 		};
// 		const resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send(updateData)
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.body).toEqual({
// 			journal: {
// 				id: expect.any(Number),
// 				userId: 1,
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				entryDate: "2022-01-04",
// 				emotions: { joy: 0.4, sad: 0.7 },
// 				journalType: "Daily Journal"
// 			}
// 		});
// 	});
// 	test("bad request with missing data", async function () {
// 		let resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 		resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				userId: 1,
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 		resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				userId: 1,
// 				title: "Updated Title",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);
// 	});

// 	test("bad request with invalid data", async function () {
// 		const resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: "happy"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(400);

// 		let resp2 = await request(app)
// 			.patch(`/users/1/journals/date/42`)
// 			.send({
// 				userId: 1,
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		// console.log(resp);
// 		expect(resp2.statusCode).toEqual(400);
// 	});

// 	test("unauth for anon", async function () {
// 		const resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			});
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("unauth if userId doesn't match the user id of the user who has the provided token", async function () {
// 		const resp = await request(app)
// 			.patch(`/users/1/journals/date/2022-01-04`)
// 			.send({
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 }
// 			})
// 			.set("authorization", `Bearer ${u2Token}`);
// 		expect(resp.statusCode).toEqual(401);
// 	});

// 	test("not found if no journal entry for the given date", async function () {
// 		const resp = await request(app)
// 			.patch(`/users/1/journals/date/2030-01-05`)
// 			.send({
// 				userId: 1,
// 				title: "Updated Title",
// 				entryText: "Updated Entry Text",
// 				emotions: { joy: 0.4, sad: 0.7 },
// 				journalType: "Gratitude Journal"
// 			})
// 			.set("authorization", `Bearer ${u1Token}`);
// 		expect(resp.statusCode).toEqual(404);
// 	});
// });

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
