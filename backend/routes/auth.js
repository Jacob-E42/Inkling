const express = require("express");
const router = express.Router();
const jsonchema = require("jsonschema");
const { BadRequestError } = require("../expressError");
// Importing JSON schemas for request validation
const userSignupSchema = require("../schema/userSignupSchema.json");
const userLoginSchema = require("../schema/userLoginSchema.json");
const User = require("../models/user");
const { createToken } = require("../helpers/token");

// POST /signup - User signup route
router.post("/signup", async (req, res, next) => {
	try {
		console.debug("/auth/signup");
		// Validate request body against JSON Schema
		const validationResult = jsonchema.validate(req.body, userSignupSchema);
		if (!validationResult.valid) {
			const errs = validationResult.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		// Extract user data from request body
		const { firstName, lastName, email, password, interests } = req.body;

		// Create a new user using the User model
		const newUser = await User.register(firstName, lastName, email, password, interests);

		// Generate authentication token
		const authToken = createToken(newUser, newUser.id);

		// Return the authentication token with a status code of 201 (Created)
		res.status(201).json({ token: authToken });
	} catch (err) {
		// Pass any errors to the error-handling middleware
		return next(err);
	}
});

// POST /login - User login route
router.post("/login", async (req, res, next) => {
	try {
		console.debug("/auth/login");
		// Validate request body against JSON Schema
		const validationResult = jsonchema.validate(req.body, userLoginSchema);
		if (!validationResult.valid) {
			const errs = validationResult.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		// Extract user data from request body
		const { email, password } = req.body;

		// Authenticate user credentials
		const authenticatedUser = await User.authenticate(email, password);

		// Generate authentication token
		const authToken = createToken(authenticatedUser, authenticatedUser.id);

		// Return the authentication token
		res.json({ token: authToken });
	} catch (err) {
		// Pass any errors to the error-handling middleware
		return next(err);
	}
});

module.exports = router;
