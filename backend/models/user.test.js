"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("./user");
const db = require("../db");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./testUtils");
const getCurrentDate = require("../helpers/getCurrentDate");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Test suite for the User model
describe("User", () => {
	// Ensuring User model is properly imported
	test("user exists", async () => {
		expect(User).toBeDefined();
	});

	// Test cases for the getById method
	describe("getById", () => {
		// Test if method properly retrieves a user by their ID
		it("should retrieve a user by their ID", async () => {
			const id = 1;
			let result;
			try {
				result = await User.getById(1);
				console.log(result);
			} catch (err) {
				expect(err instanceof NotFoundError).toBeFalsy();
			}

			expect(result).toBeDefined();
			expect(result.id).toBe(id);
		});

		// Test if method returns a NotFoundError when no user is found by ID
		it("should return NotFoundError if no such id", async () => {
			try {
				await User.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	// Test cases for the getCreatedAtById method
	describe("getCreatedAtById", () => {
		// Test if method properly retrieves a created_at date by their ID
		it("should retrieve a created_at by their ID", async () => {
			console.log("BEGIN TEST: should retrieve created_at------------------------->");
			const today = getCurrentDate();
			let result;
			try {
				result = await User.getCreatedAtById(1);
				console.log(result);
			} catch (err) {
				console.log(err);
				expect(err instanceof NotFoundError).toBeFalsy();
			}
			console.log(result);
			expect(result).toBeDefined();
			expect(result.length).toBe(10);
			expect(result).toBe(today);
		});

		// Test if method returns a NotFoundError when no created_at is found by ID
		it("should return NotFoundError if no such id", async () => {
			try {
				await User.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	// Similar blocks for getByEmail, register, and authenticate methods

	// describe("getByEmail", () => {
	// 	it("should retrieve a user by their email", async () => {
	// 		const email = "user1@user.com";
	// 		const result = await User.getByEmail(email);

	// 		expect(result).toBeDefined();

	// 		expect(result.email).toBe(email);
	// 	});

	// 	it("should should return NotFoundError if user with that email doesn't exist", async () => {
	// 		try {
	// 			await User.getByEmail("thiswontwork@email.com");
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof NotFoundError).toBeTruthy();
	// 		}
	// 	});
	// });

	// describe("register", () => {
	// 	it("should register a new user", async () => {
	// 		const firstName = "John";
	// 		const lastName = "Doe";
	// 		const email = "test@example.com";
	// 		const password = "password";

	// 		const result = await User.register(firstName, lastName, email, password);

	// 		expect(result).toBeDefined();
	// 		expect(result.first_name).toBe(firstName);
	// 		expect(result.last_name).toBe(lastName);
	// 		expect(result.email).toBe(email);
	// 	});

	// 	it("should throw BadRequestError if user with the same email already exists", async () => {
	// 		const firstName = "John";
	// 		const lastName = "Doe";
	// 		const email = "john@example.com";
	// 		const password = "password";

	// 		try {
	// 			await User.register(firstName, lastName, email, password);
	// 		} catch (error) {
	// 			expect(error).toBeInstanceOf(BadRequestError);
	// 			expect(error.message).toBe("User with this email already exists");
	// 		}
	// 	});
	// });

	// describe("authenticate", function () {
	// 	test("works", async function () {
	// 		let res;
	// 		try {
	// 			res = await User.authenticate("user1@user.com", "password1");
	// 		} catch (err) {
	// 			console.error(err);
	// 		}

	// 		expect(res).toEqual({
	// 			id: 1,
	// 			firstName: "U1F",
	// 			lastName: "U1L",
	// 			email: "user1@user.com"
	// 		});
	// 	});

	// 	test("unauth if no such user", async function () {
	// 		try {
	// 			await User.authenticate("horseface@test.com", "password");
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof UnauthorizedError).toBeTruthy();
	// 		}
	// 	});

	// 	test("unauth if wrong password", async function () {
	// 		try {
	// 			await User.authenticate("user1@user.com", "wrong");
	// 			fail();
	// 		} catch (err) {
	// 			// console.log(err);
	// 			expect(err instanceof UnauthorizedError).toBeTruthy();
	// 		}
	// 	});
	// });

	/************************************** update */

	// describe("update", function () {
	// 	const updateData = {
	// 		firstName: "NewF",
	// 		lastName: "NewL",
	// 		email: "new@email.com"
	// 	};

	// 	test("works", async function () {
	// 		let user = await User.update("user1@user.com", updateData);
	// 		console.log(user);
	// 		expect(user).toEqual({
	// 			firstName: "NewF",
	// 			lastName: "NewL",
	// 			email: "new@email.com"
	// 		});
	// 	});

	// 	test("works: set password", async function () {
	// 		let user = await User.update("user1@user.com", {
	// 			password: "newfht55"
	// 		});
	// 		expect(user).toEqual({
	// 			firstName: "U1F",
	// 			lastName: "U1L",
	// 			email: "user1@user.com"
	// 		});
	// 		const found = await db.query("SELECT * FROM users WHERE email = 'user1@user.com'");
	// 		expect(found.rows.length).toEqual(1);
	// 		expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
	// 	});

	// 	test("not found if no such user", async function () {
	// 		try {
	// 			await User.update("nope@email.com", {
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
	// 			await User.update("user1@user.com", {});
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof BadRequestError).toBeTruthy();
	// 		}
	// 	});
	// });

	/************************************** remove */

	// describe("remove", function () {
	// 	test("works", async function () {
	// 		await User.remove("u1");
	// 		const res = await db.query("SELECT * FROM users WHERE username='u1'");
	// 		expect(res.rows.length).toEqual(0);
	// 	});

	// 	test("not found if no such user", async function () {
	// 		try {
	// 			await User.remove("nope");
	// 			fail();
	// 		} catch (err) {
	// 			expect(err instanceof NotFoundError).toBeTruthy();
	// 		}
	// 	});
	// });
});
