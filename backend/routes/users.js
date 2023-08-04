const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schema/userUpdateSchema.json");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/authMiddleware");

router.get("/:email", ensureCorrectUser, async function (req, res, next) {
	console.debug("/users/email GET ");

	// Create an instance of the User class

	try {
		const user = await User.getByEmail(req.params.email);
		console.log("users/", user);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

//Update a user's firstName, lastName, email or interests
router.patch("/:email", ensureCorrectUser, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		const user = await User.update(req.params.email, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
