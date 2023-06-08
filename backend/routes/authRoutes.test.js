"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const request = require("supertest");

const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const db = require("../db");
let user;

describe("User", () => {
	beforeAll(async () => {
		// Clear all data from the users table
		try {
			await db.query("DELETE FROM users");
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

	describe("POST /auth/signup", function () {
		test("works for new user", async function () {
			const resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});

			if (resp.error) {
				console.log(resp.error);
			}

			expect(resp.statusCode).toEqual(201);
			expect(resp.body).toEqual({
				token: expect.any(String)
			});
		});

		test("bad request with missing fields", async function () {
			let resp = await request(app)
				.post("/auth/signup")
				.send({
					lastName: "last",
					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",

					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",

					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",

					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);
			resp = await request(app).post("/auth/signup").send({
				firstName: "first",
				lastName: "last",
				password: "password",
				email: "new@email.com"
			});
			expect(resp.statusCode).toEqual(400);
		});

		test("bad request with invalid data", async function () {
			let resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",
					email: "not-an-email",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);

			resp = await request(app).post("/auth/signup").send({
				firstName: "first",
				lastName: "last",
				password: "password",
				email: "tst@emial.com",
				interests: "gratitude"
			});
			expect(resp.statusCode).toEqual(400);
		});
	});
});
