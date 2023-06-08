"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const User = require("./user");
const bcrypt = require("bcrypt");
const db = require("../db");
let user;

describe("User", () => {
	beforeAll(async () => {
		// Clear all data from the users table
		try {
			const res = await db.query("DELETE FROM users");
		} catch (err) {
			console.error(err);
		}

		// Insert sample users into the database
		const hashedPassword = await bcrypt.hash("password", 1);
		const userData = [
			{
				id: 1,
				first_name: "John",
				last_name: "Doe",
				email: "john@example.com",
				password: hashedPassword,
				interests: ["gratitude", "dailyjournal"]
			},
			{
				id: 2,
				first_name: "Jane",
				last_name: "Smith",
				email: "jane@example.com",
				password: hashedPassword,
				interests: ["gratitude", "daily journal"]
			}
		];

		const insertQuery = `
            INSERT INTO users (id, first_name, last_name, email, password, interests)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;

		for (const user of userData) {
			const { id, first_name, last_name, email, password, interests } = user;
			await db.query(insertQuery, [id, first_name, last_name, email, password, interests]);
		}

		// Create a new instance of the User class
		user = new User();
	});

	afterAll(async () => {
		// End the database connection
		try {
			await db.end();
			console.log("Database connection closed");
		} catch (err) {
			console.error("Error closing database connection:", err);
		}
	});

	beforeEach(async () => {
		// Start a new transaction
		await db.query("BEGIN");
	});

	afterEach(async () => {
		// Rollback the transaction
		await db.query("ROLLBACK");
	});

	test("user exists", async () => {
		expect(user).toBeDefined();
	});

	describe("getById", () => {
		it("should retrieve a user by their ID", async () => {
			const id = 1;
			const result = await user.getById(id);

			expect(result).toBeDefined();
			expect(result.id).toBe(id);
		});

		it("should should return NotFoundError if no such id", async () => {
			try {
				await user.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	describe("getByEmail", () => {
		it("should retrieve a user by their email", async () => {
			const email = "john@example.com";
			const result = await user.getByEmail(email);

			expect(result).toBeDefined();

			expect(result.email).toBe(email);
		});
		it("should should return null if user with that email doesn't exist", async () => {
			const res = await user.getByEmail("thiswontwork@email.com");
			expect(res).toBeNull();
		});
	});

	describe("register", () => {
		it("should register a new user", async () => {
			const firstName = "John";
			const lastName = "Doe";
			const email = "test@example.com";
			const password = "password";
			const interests = ["interest1", "interest2"];

			const result = await user.register(firstName, lastName, email, password, interests);

			expect(result).toBeDefined();
			expect(result.first_name).toBe(firstName);
			expect(result.last_name).toBe(lastName);
			expect(result.email).toBe(email);
			expect(result.interests).toEqual(interests);
		});

		it("should throw BadRequestError if user with the same email already exists", async () => {
			const firstName = "John";
			const lastName = "Doe";
			const email = "john@example.com";
			const password = "password";
			const interests = ["interest1", "interest2"];

			try {
				await user.register(firstName, lastName, email, password, interests);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestError);
				expect(error.message).toBe("User with this email already exists");
			}
		});
	});

	describe("authenticate", function () {
		test("works", async function () {
			const res = await user.authenticate("john@example.com", "password");
			expect(res).toEqual({
				id: 1,
				first_name: "John",
				last_name: "Doe",
				email: "john@example.com",
				interests: ["gratitude", "dailyjournal"]
			});
		});

		test("unauth if no such user", async function () {
			try {
				await user.authenticate("horseface@test.com", "password");
				fail();
			} catch (err) {
				expect(err instanceof UnauthorizedError).toBeTruthy();
			}
		});

		test("unauth if wrong password", async function () {
			try {
				await user.authenticate("john@example.com", "wrong");
				fail();
			} catch (err) {
				// console.log(err);
				expect(err instanceof UnauthorizedError).toBeTruthy();
			}
		});
	});
});
