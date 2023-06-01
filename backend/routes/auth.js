const express = require("express");
const router = express.Router();
const jsonchema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const { userAuthSchema } = require("../schema/schemas");
const User = require("../models/user");
const { createToken } = require("../helpers/token");

// POST /signup - User signup route
router.post("/signup", async (req, res, next) => {
	try {
		// Validate request body against JSON Schema
		const validationResult = jsonchema.validate(req.body, userAuthSchema);
		if (validationResult.error) {
			throw new BadRequestError(validationResult.error.details[0].message);
		}

		// Extract user data from request body
		const { firstName, lastName, email, password, interests } = req.body;

		// Create an instance of the User class
		const user = new User();

		// Create a new user using the User model
		const newUser = await user.register(firstName, lastName, email, password, interests);
		console.log(newUser, "newUser");

		// Generate authentication token
		const authToken = createToken(newUser);

		// Return the authentication token with a status code of 201 (Created)
		res.status(201).json({ token: authToken });
	} catch (err) {
		// Pass any errors to the error-handling middleware
		return next(err);
	}
});

module.exports = router;
