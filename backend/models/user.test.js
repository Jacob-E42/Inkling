"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const User = require("./user");
const bcrypt = require("bcrypt");
const db = require("../db");

// const Pool = require("pg-pool");
// const pool = new Pool({});

describe("User", () => {
	let user;

	beforeAll(async () => {
		// Clear all data from the users table
		await db.query("DELETE FROM users");

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
			await client.query(insertQuery, [id, first_name, last_name, email, password, interests]);
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
		await db.query("BEGIN");

		// Start a new transaction
	});

	afterEach(async () => {
		// Rollback the transaction
		await db.query("ROLLBACK");
	});

	describe("getById", () => {
		it("should retrieve a user by their ID", async () => {
			// console.log(await db.select("*").from("users"));
			console.log(user);

			const id = 1;
			const result = await user.getById(id);
			console.log(result);
			expect(result).toBeDefined();
			expect(result.id).toBe(id);
		});

		it("should should return NotFoundError if no such id", async () => {
			// console.log(await db.select("*").from("users"));
			try {
				await user.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	// describe("getByEmail", () => {
	// 	it("should retrieve a user by their email", async () => {
	// 		console.log(await db.select("*").from("users"));
	// 		const email = "test@example.com";
	// 		const result = await user.getByEmail(email);
	// 		console.log(await db.select("*").from("users"));
	// 		expect(result).toBeDefined();
	// 		console.log(result);
	// 		expect(result.email).toBe(email);
	// 	});
	// });

	// describe("register", () => {
	// 	it("should register a new user", async () => {
	// 		console.log(await db.select("*").from("users"));
	// 		const firstName = "John";
	// 		const lastName = "Doe";
	// 		const email = "test@example.com";
	// 		const password = "password";
	// 		const interests = ["interest1", "interest2"];

	// 		const result = await user.register(firstName, lastName, email, password, interests);
	// 		console.log(await db.select("*").from("users"));
	// 		expect(result).toBeDefined();
	// 		expect(result.first_name).toBe(firstName);
	// 		expect(result.last_name).toBe(lastName);
	// 		expect(result.email).toBe(email);
	// 		expect(result.interests).toEqual(interests);
	// 	});

	// 	it("should throw BadRequestError if user with the same email already exists", async () => {
	// 		console.log(await db.select("*").from("users"));
	// 		const firstName = "John";
	// 		const lastName = "Doe";
	// 		const email = "test@example.com";
	// 		const password = "password";
	// 		const interests = ["interest1", "interest2"];

	// 		try {
	// 			await user.register(firstName, lastName, email, password, interests);
	// 			console.log(await db.select("*").from("users"));
	// 		} catch (error) {
	// 			expect(error).toBeInstanceOf(BadRequestError);
	// 			expect(error.message).toBe("User with this email already exists");
	// 		}
	// 	});
	// });
});
