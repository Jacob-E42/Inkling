"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const request = require("supertest");

const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const db = require("../db");

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	u3Token
} = require("../models/testUtils.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Continues the user tests
describe("User", () => {
	// Testing the signup route
	describe("POST /auth/signup", function () {
		// Testing a valid new user
		test("works for new user", async function () {
			// Sending a POST request to /auth/signup with valid data
			const resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});

			// If there's an error, log it
			if (resp.error) {
				console.log(resp.error);
			}

			// Expect a status code of 201 and the response to contain a token
			expect(resp.statusCode).toEqual(201);
			expect(resp.body).toEqual({
				token: expect.any(String)
			});
		});

		// Testing with missing fields
		test("bad request with missing fields", async function () {
			// Sending POST requests to /auth/signup with missing fields and expecting a 400 status code
			// Missing firstName
			let resp = await request(app)
				.post("/auth/signup")
				.send({
					lastName: "last",
					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);

			// Missing password
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",

					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);

			// Missing email
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",

					password: "password",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);

			// Missing interests
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",

					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400);

			// Testing with short password
			resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "pass", // password too short
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400); // expect 400 status (Bad Request) as the password is too short
		});

		// Testing signup with invalid data
		test("bad request with invalid data", async function () {
			// Sending a POST request to /auth/signup with invalid email
			let resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "password",
					email: "not-an-email", // not a valid email
					interests: ["gratitude", "habit building"]
				});
			expect(resp.statusCode).toEqual(400); // expect 400 status (Bad Request) as the email is not valid

			// Sending a POST request to /auth/signup with invalid interests
			resp = await request(app).post("/auth/signup").send({
				firstName: "first",
				lastName: "last",
				password: "password",
				email: "tst@emial.com",
				interests: "gratitude" // interests should be an array, not a string
			});
			expect(resp.statusCode).toEqual(400); // expect 400 status (Bad Request) as the interests is not an array
		});
	});

	// Testing the login route
	describe("POST /auth/login", function () {
		// Testing a valid login
		test("works", async function () {
			// Sending a POST request to /auth/login with valid data
			const resp = await request(app).post("/auth/login").send({
				email: "user1@user.com",
				password: "password1"
			});
			// Expect the response to contain a token
			expect(resp.body).toEqual({
				token: expect.any(String)
			});
		});

		// Testing login with non-existent user
		test("unauth with non-existent user", async function () {
			// Sending a POST request to /auth/login with an email that doesn't exist
			const resp = await request(app).post("/auth/login").send({
				email: "none@email.com",
				password: "password"
			});
			// Expect a status code of 401 (Unauthorized)
			expect(resp.statusCode).toEqual(401);
		});

		// Testing login with wrong password
		test("unauth with wrong password", async function () {
			// Sending a POST request to /auth/login with a correct email but incorrect password
			const resp = await request(app).post("/auth/login").send({
				email: "user1@user.com",
				password: "nothappening" // wrong password
			});
			// Expect a status code of 401 (Unauthorized)
			expect(resp.statusCode).toEqual(401);
		});

		// Testing login with missing data
		test("bad request with missing data", async function () {
			// Sending a POST request to /auth/login with missing email
			let resp = await request(app).post("/auth/login").send({
				email: "user1@user.com"
			});
			expect(resp.statusCode).toEqual(400); // expect 400 status (Bad Request) as the password is missing

			// Sending a POST request to /auth/login with missing password
			resp = await request(app).post("/auth/login").send({
				password: "password"
			});
			expect(resp.statusCode).toEqual(400); // expect 400 status (Bad Request) as the email is missing
		});

		// Testing login with invalid data
		test("bad request with invalid data", async function () {
			// Sending a POST request to /auth/login with invalid email (not a string)
			const resp = await request(app).post("/auth/login").send({
				email: 42, // invalid email
				password: "password"
			});
			// Expect a status code of 400 (Bad Request)
			expect(resp.statusCode).toEqual(400);
		});
	});
});
