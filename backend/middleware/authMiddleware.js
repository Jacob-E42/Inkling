"use strict";

/** This module provides middlewares related to authentication of the user. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Authenticate user.
 *
 * If a token was provided in the request header, it verifies the token and if valid,
 * stores the token payload on res.locals. This will include the email of the user.
 *
 * This function doesn't throw an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace(/^[Bb]earer /, "").trim();
			res.locals.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (err) {
		return next();
	}
}

/**
 * Middleware: Check if user is logged in.
 *
 * If the user is not logged in (no user info in res.locals), it throws UnauthorizedError.
 */
function ensureLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) throw new UnauthorizedError();
		return next();
	} catch (err) {
		return next(err);
	}
}

/**
 * Middleware: Check if user is the correct user.
 *
 * It checks whether the user from the token matches the user email provided as route parameter.
 * If not, it throws UnauthorizedError.
 */
function ensureCorrectUserByEmail(req, res, next) {
	try {
		const user = res.locals.user;
		if (!(user && user.email === req.params.email)) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/**
 * Middleware: Check if user is the correct user.
 *
 * It checks whether the user from the token matches the user email provided as route parameter.
 * If not, it throws UnauthorizedError.
 */
function ensureCorrectUserByUserId(req, res, next) {
	try {
		const user = res.locals.user;
		if (!(user && user.email === req.params.email)) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUserByEmail,
	ensureCorrectUserByUserId
};
