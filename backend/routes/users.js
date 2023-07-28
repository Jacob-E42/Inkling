const express = require("express");
const router = express.Router();
const jsonchema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/authMiddleware");

//ask about this
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

module.exports = router;
