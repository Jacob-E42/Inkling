const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const receiveEmotionsSchema = require("../schema/receiveEmotionsSchema.json");
const { BadRequestError, NotFoundError } = require("../expressError");
const { getNLU } = require("../emotionsAPI/emotion");
const { ensureCorrectUserByUserId } = require("../middleware/authMiddleware");

router.post("/", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("POST /feedback/\n", req.body.id);

	try {
		// Validate the request body against the predefined JSON schema
		const validator = jsonschema.validate(req.body, receiveEmotionsSchema);

		// If validation fails, map through the errors to retrieve the stacks and throw them
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		// Check if the user ID in the request body matches the user ID in the request parameters
		if (String(req.body.userId) !== req.params.userId) throw new BadRequestError("Incorrect user ID");

		const entryText = req.body.entryText || "";

		// Retrieve emotions for the given entry text
		const emotions = await getNLU(entryText, req.body.userId);
		return res.json({ emotions });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
