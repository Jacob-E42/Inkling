const express = require("express");
const router = express.Router();
const jsonchema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const User = require("../models/user");

router.get("/:email", async function (req, res, next) {
	console.debug("/users/email GET ");

	// Create an instance of the User class
	const user = new User();

	try {
		const user = await user.getByEmail(req.params.email);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
