"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const Journal = require("./journal");
const db = require("../db");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./testUtils");

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

			expect(result.entry_date).toBe(date);
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

	describe("createEntry", () => {
		it("should create a new Journal entry", async () => {
			const user_id = 1;
			const title = "Surprise Visit";
			const entry_text = "Out of nowhere, my uncle and aunt came over to my house today.";
			const entry_date = "2022-08-04";

			const result = await Journal.createEntry(user_id, title, entry_text, entry_date);

			expect(result).toBeDefined();
			expect(result.title).toBe(title);
			expect(result.user_id).toBe(user_id);
			expect(result.entry_text).toBe(entry_text);
			expect(result.entry_date).toEqual(entry_date);
		});

		it("should throw BadRequestError if Journal with the same date already exists", async () => {
			const user_id = 1;
			const title = "Surprise Visit";
			const entry_text = "Out of nowhere, my uncle and aunt came over to my house today.";
			const entry_date = "2022-01-04";

			try {
				const result = await Journal.createEntry(user_id, title, entry_text, entry_date);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestError);
				expect(error.message).toBe("A journal entry written on this day already exists");
			}
		});
	});

	/************************************** update */

	// describe("update", function () {
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
