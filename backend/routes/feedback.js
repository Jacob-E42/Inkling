const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const receiveFeedbackSchema = require("../schema/receiveFeedbackSchema.json");
const { BadRequestError, NotFoundError } = require("../expressError");
const { getCompletion } = require("../feedbackAPI/prompts");
const { ensureCorrectUserByUserId } = require("../middleware/authMiddleware");

// Endpoint for creating feedback, with middleware to ensure the user making the request is correct
router.post("/", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("POST /feedback/\n", req.body.id, req.body.journalType);

	try {
		// Validate the request body against the predefined JSON schema
		const validator = jsonschema.validate(req.body, receiveFeedbackSchema);

		// If validation fails, map through the errors to retrieve the stacks and throw them
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		// Check if the user ID in the request body matches the user ID in the request parameters
		if (String(req.body.userId) !== req.params.userId) throw new BadRequestError("Incorrect user ID");

		const entryText = req.body.entryText || "";

		// Retrieve feedback for the given entry text
		const feedback = await getCompletion(entryText, req.body.journalType, req.body.userId);
		return res.json({ feedback });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
