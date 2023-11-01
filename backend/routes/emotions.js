const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const receiveEmotionsSchema = require("../schema/receiveEmotionsSchema.json");
const { BadRequestError, NotFoundError } = require("../expressError");
const { getNLU } = require("../emotionsAPI/emotion");
const { ensureCorrectUserByUserId } = require("../middleware/authMiddleware");
const Journal = require("../models/journal");

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

		const { userId, title, entryText, entryDate, journalType } = req.body;

		// Retrieve emotions for the given entry text
		const resp = await getNLU(entryText, req.body.userId);
		const emotions = resp.emotion.document.emotion;
		console.log(emotions);
		if (resp) await Journal.updateEntry(userId, title, entryText, entryDate, emotions, journalType);
		return res.json({ emotions });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
