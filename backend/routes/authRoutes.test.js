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
} = require("./testUtils.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User", () => {
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

		test("bad request with short password", async function () {
			let resp = await request(app)
				.post("/auth/signup")
				.send({
					firstName: "first",
					lastName: "last",
					password: "pass",
					email: "new@email.com",
					interests: ["gratitude", "habit building"]
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

	describe("POST /auth/login", function () {
		test("works", async function () {
			const resp = await request(app).post("/auth/login").send({
				email: "user1@user.com",
				password: "password1"
			});
			expect(resp.body).toEqual({
				token: expect.any(String)
			});
		});

		test("unauth with non-existent user", async function () {
			const resp = await request(app).post("/auth/login").send({
				email: "none@email.com",
				password: "password"
			});
			expect(resp.statusCode).toEqual(401);
		});

		test("unauth with wrong password", async function () {
			const resp = await request(app).post("/auth/login").send({
				email: "user1@user.com",
				password: "nothappening"
			});
			expect(resp.statusCode).toEqual(401);
		});

		test("bad request with missing data", async function () {
			let resp = await request(app).post("/auth/login").send({
				email: "user1@user.com"
			});
			expect(resp.statusCode).toEqual(400);

			resp = await request(app).post("/auth/login").send({
				password: "password"
			});
			expect(resp.statusCode).toEqual(400);
		});

		test("bad request with invalid data", async function () {
			const resp = await request(app).post("/auth/login").send({
				email: 42,
				password: "password"
			});
			expect(resp.statusCode).toEqual(400);
		});
	});
});
