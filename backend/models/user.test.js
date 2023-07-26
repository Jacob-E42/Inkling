"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const User = require("./user");

const db = require("../db");

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./testUtils");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User", () => {
	test("user exists", async () => {
		expect(User).toBeDefined();
	});

	describe("getById", () => {
		it("should retrieve a user by their ID", async () => {
			const id = 1;
			let result;
			try {
				result = await User.getByEmail("user1@user.com");
				console.log(result);
			} catch (err) {
				expect(err instanceof NotFoundError).toBeFalsy();
			}

			expect(result).toBeDefined();
			expect(result.id).toBe(id);
		});

		it("should should return NotFoundError if no such id", async () => {
			try {
				await User.getById(1000);
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	describe("getByEmail", () => {
		it("should retrieve a user by their email", async () => {
			const email = "user1@user.com";
			const result = await User.getByEmail(email);

			expect(result).toBeDefined();

			expect(result.email).toBe(email);
		});

		it("should should return NotFoundError if user with that email doesn't exist", async () => {
			try {
				await User.getByEmail("thiswontwork@email.com");
				fail();
			} catch (err) {
				expect(err instanceof NotFoundError).toBeTruthy();
			}
		});
	});

	describe("register", () => {
		it("should register a new user", async () => {
			const firstName = "John";
			const lastName = "Doe";
			const email = "test@example.com";
			const password = "password";
			const interests = ["interest1", "interest2"];

			const result = await User.register(firstName, lastName, email, password, interests);

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
				await User.register(firstName, lastName, email, password, interests);
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestError);
				expect(error.message).toBe("User with this email already exists");
			}
		});
	});

	describe("authenticate", function () {
		test("works", async function () {
			let res;
			try {
				res = await User.authenticate("user1@user.com", "password1");
			} catch (err) {
				console.error(err);
			}

			expect(res).toEqual({
				id: 1,
				firstName: "U1F",
				lastName: "U1L",
				email: "user1@user.com",
				interests: ["interest1", "interest2"]
			});
		});

		test("unauth if no such user", async function () {
			try {
				await User.authenticate("horseface@test.com", "password");
				fail();
			} catch (err) {
				expect(err instanceof UnauthorizedError).toBeTruthy();
			}
		});

		test("unauth if wrong password", async function () {
			try {
				await User.authenticate("user1@user.com", "wrong");
				fail();
			} catch (err) {
				// console.log(err);
				expect(err instanceof UnauthorizedError).toBeTruthy();
			}
		});
	});
});
