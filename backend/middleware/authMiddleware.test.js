"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("./authMiddleware");
const { SECRET_KEY } = require("../config");

// Generate JWTs for testing purposes
const testJwt = jwt.sign({ email: "test@email.com" }, SECRET_KEY); // Valid JWT
const badJwt = jwt.sign({ email: "test@email.com" }, "wrong"); // Invalid JWT

// Test suite for 'authenticateJWT' function
describe("authenticateJWT", function () {
	// Test that a valid JWT in the header gets authenticated correctly
	test("works: via header", function () {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${testJwt}` } };
		const res = { locals: {} };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res.locals).toEqual({
			user: {
				iat: expect.any(Number),
				email: "test@email.com"
			}
		});
	});

	// Test that the function works when there's no JWT in the header
	test("works: no header", function () {
		expect.assertions(2);
		const req = {};
		const res = { locals: {} };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res.locals).toEqual({});
	});

	// Test that the function works when provided with an invalid JWT
	test("works: invalid token", function () {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${badJwt}` } };
		const res = { locals: {} };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(res.locals).toEqual({});
	});
});

// Test suite for 'ensureLoggedIn' function
describe("ensureLoggedIn", function () {
	// Test that a logged in user is recognized correctly
	test("works", function () {
		expect.assertions(1);
		const req = {};
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureLoggedIn(req, res, next);
	});

	// Test that unauthorized access without login is correctly identified
	test("unauth if no login", function () {
		expect.assertions(1);
		const req = {};
		const res = { locals: {} };
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureLoggedIn(req, res, next);
	});
});

// Test suite for 'ensureCorrectUser' function
describe("ensureCorrectUser", function () {
	// Test that the function correctly verifies when the correct user is accessing
	test("works: same user", function () {
		expect.assertions(1);
		const req = { params: { email: "test@email.com" } };
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureCorrectUser(req, res, next);
	});

	// Test that unauthorized access due to mismatched users is correctly identified
	test("unauth: mismatch", function () {
		expect.assertions(1);
		const req = { params: { email: "test@gfdsgfsil.com" } };
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureCorrectUser(req, res, next);
	});

	// Test that unauthorized access by an anonymous user is correctly identified
	test("unauth: if anon", function () {
		expect.assertions(1);
		const req = { params: { email: "test@email.com" } };
		const res = { locals: {} };
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureCorrectUser(req, res, next);
	});
});
