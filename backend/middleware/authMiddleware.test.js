"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("./authMiddleware");

const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ email: "test@email.com" }, SECRET_KEY);
const badJwt = jwt.sign({ email: "test@email.com" }, "wrong");

describe("authenticateJWT", function () {
	test("works: via header", function () {
		expect.assertions(2);
		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
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

describe("ensureLoggedIn", function () {
	test("works", function () {
		expect.assertions(1);
		const req = {};
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureLoggedIn(req, res, next);
	});

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

describe("ensureCorrectUser", function () {
	test("works: same user", function () {
		expect.assertions(1);
		const req = { params: { email: "test@email.com" } };
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureCorrectUser(req, res, next);
	});

	test("unauth: mismatch", function () {
		expect.assertions(1);
		const req = { params: { email: "test@gfdsgfsil.com" } };
		const res = { locals: { user: { email: "test@email.com" } } };
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureCorrectUser(req, res, next);
	});

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
