"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const Journal = require("./journal");
const db = require("../db");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./testUtils");
const { DatabaseError } = require("pg");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Test suite for the Journal model
describe("Journal", () => {
	// Ensuring Journal model is properly imported
	test("Journal exists", async () => {
		expect(Journal).toBeDefined();
	});

	// Test cases for the getById method
	describe("getById", () => {
		// Test if method properly retrieves a Journal by their ID
		it("should retrieve a Journal by their ID", async () => {
			const id = 1;
			let result;
			try {
				result = await Journal.getById(1);
				console.log(result);
			} catch (err) {
				expect(err instanceof NotFoundError).toBeFalsy();
			}

			expect(result).toBeDefined();
			expect(result.id).toBe(id);
		});

		// Test if method returns a NotFoundError when no Journal is found by ID
		it("should return NotFoundError if no such id", async () => {
			try {
				await Journal.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	// Similar blocks for getByDate, register, and authenticate methods

	describe("getByDate", () => {
		it("should retrieve a Journal by its date", async () => {
			const date = "2022-01-04";
			const result = await Journal.getByDate(1, date);
			console.log(result);
			expect(result).toBeDefined();

			expect(result.entryDate).toBe(date);
		});

		it("should should return NotFoundError if Journal with that date doesn't exist", async () => {
			try {
				await Journal.getByDate(1, "2022-08-04");
				fail();
			} catch (err) {
				console.log(err);
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	describe("getDatesRange", () => {
		const mockUserId = 1;

		// Mock the Journal.getByDate method
		beforeAll(() => {
			spyOn(Journal, "getByDate").and.callFake((userId, date) => {
				if (date === "2022-01-04") {
					// Simulate finding a journal entry for this date
					return new Journal({ id: 123, entryDate: date });
				} else {
					// Simulate no journal entry found for other dates
					throw new NotFoundError();
				}
			});
		});

		it("should retrieve an array of journal existences by date range", async () => {
			const dateRange = ["2022-01-04", "2022-01-05"];
			const result = await Journal.getDatesRange(mockUserId, dateRange);
			console.log(result);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toEqual([
				{ date: "2022-01-04", exists: true },
				{ date: "2022-01-05", exists: false }
			]);
		});

		it("should return error if any of the dates are not handled correctly", async () => {
			// Include a date that would cause a different error in the range
			const dateRangeWithError = ["2022-01-04", "2022-01-05", "error-date"];

			spyOn(Journal, "getByDate").and.callFake((userId, date) => {
				if (date === "error-date") {
					throw new ExpressError("Invalid date format", 400);
				}
				return Journal.getByDate.calls.mostRecent().returnValue;
			});

			try {
				await Journal.getDatesRange(mockUserId, dateRangeWithError);
				fail("Expected method to throw");
			} catch (err) {
				expect(err instanceof ExpressError).toBeTruthy();
				expect(err.message).toBe("One or more of the dates wasn't handled correctly");
			}
		});

		// Clean up the mock
		afterAll(() => {
			Journal.getByDate.and.callThrough();
		});
	});

	describe("createEntry", () => {
		it("should create a new Journal entry", async () => {
			const userId = 1;
			const title = "Surprise Visit";
			const entryText = "Out of nowhere, my uncle and aunt came over to my house today.";
			const entryDate = "2022-08-04";
			const journalType = "Gratitude Journaling";
			const result = await Journal.createEntry(userId, title, entryText, entryDate, journalType);

			expect(result).toBeDefined();
			expect(result.title).toBe(title);
			expect(result.userId).toBe(userId);
			expect(result.entryText).toBe(entryText);
			expect(result.entryDate).toEqual(entryDate);
			expect(result.journalType).toBe(journalType);
		});

		it("should throw Database Error if Journal with the same date already exists", async () => {
			const user_id = 1;
			const title = "Surprise Visit";
			const entryText = "Out of nowhere, my uncle and aunt came over to my house today.";
			const entryDate = "2022-01-04";
			const journalType = "Gratitude Journaling";

			let result;
			try {
				result = await Journal.createEntry(user_id, title, entryText, entryDate, journalType);
			} catch (error) {
				console.log(error);
				expect(error).toBeInstanceOf(DatabaseError);
				expect(error.message).toBe(
					'duplicate key value violates unique constraint "journal_entries_user_id_entry_date_key"'
				);
			}
		});
	});

	/************************************** update */

	describe("updateEntry", function () {
		const updateData = {
			title: "Updated Title",
			entryText: "Updated entry text"
		};

		test("works", async function () {
			let updatedJournal = await Journal.updateEntry(
				1,
				"Updated Title",
				"Updated entry text",
				"2022-01-04",
				null,
				"Remorseful Journaling"
			);
			expect(updatedJournal).toEqual({
				id: 1,
				userId: 1,
				title: "Updated Title",
				entryText: "Updated entry text",
				entryDate: "2022-01-04",
				emotions: null,
				journalType: "Remorseful Journaling" // Expecting a JSON string here
			});
		});

		test("not found if no such journal entry", async function () {
			try {
				const resp = await Journal.updateEntry(
					1,
					"New Title",
					"New Text",
					"2025-01-04",
					null,
					"Gratitude Journaling"
				);
				console.log("resp=", resp);
				fail();
			} catch (err) {
				console.log(err);
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});

		test("bad request if no data", async function () {
			expect.assertions(1);
			try {
				const resp = await Journal.updateEntry(1, null, null, "2022-01-04", null, null);
				console.log("resp=", resp);
				fail();
			} catch (err) {
				expect(err instanceof BadRequestError).toBeTruthy();
			}
		});
	});

	// describe("updateEntry", function () {
	// 	const updateData = {
	// 		firstName: "NewF",
	// 		lastName: "NewL",
	// 		date: "new@date.com",
	// 		interests: ["interest1", "interest3"]
	// 	};

	// 	test("works", async function () {
	// 		let Journal = await Journal.update("Journal1@Journal.com", updateData);
	// 		console.log(Journal);
	// 		expect(Journal).toEqual({
	// 			firstName: "NewF",
	// 			lastName: "NewL",
	// 			date: "new@date.com",
	// 			interests: ["interest1", "interest3"]
	// 		});
	// 	});

	// 	test("works: set password", async function () {
	// 		let Journal = await Journal.update("Journal1@Journal.com", {
	// 			password: "newfht55"
	// 		});
	// 		expect(Journal).toEqual({
	// 			firstName: "U1F",
	// 			lastName: "U1L",
	// 			date: "Journal1@Journal.com",
	// 			interests: ["interest1", "interest2"]
	// 		});
	// 		const found = await db.query("SELECT * FROM Journals WHERE date = 'Journal1@Journal.com'");
	// 		expect(found.rows.length).toEqual(1);
	// 		expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
	// 	});

	// 	test("not found if no such Journal", async function () {
	// 		try {
	// 			await Journal.update("nope@date.com", {
	// 				firstName: "test"
	// 			});
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof NotFoundError).toBeTruthy();
	// 		}
	// 	});

	// 	test("bad request if no data", async function () {
	// 		expect.assertions(1);
	// 		try {
	// 			await Journal.update("Journal1@Journal.com", {});
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof BadRequestError).toBeTruthy();
	// 		}
	// 	});
	// });

	/************************************** remove */

	// describe("remove", function () {
	// 	test("works", async function () {
	// 		await Journal.remove("u1");
	// 		const res = await db.query("SELECT * FROM Journals WHERE Journalname='u1'");
	// 		expect(res.rows.length).toEqual(0);
	// 	});

	// 	test("not found if no such Journal", async function () {
	// 		try {
	// 			await Journal.remove("nope");
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof NotFoundError).toBeTruthy();
	// 		}
	// 	});
	// });
});
