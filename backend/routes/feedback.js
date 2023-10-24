const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const receiveFeedbackSchema = require("../schema/receiveFeedbackSchema.json");
const { BadRequestError, NotFoundError } = require("../expressError");
const { generatePrompt, getCompletion } = require("../feedbackAPI/prompts");
const { ensureCorrectUserByUserId } = require("../middleware/authMiddleware");

router.post("/", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("POST /feedback/ ");

	try {
		const validator = jsonschema.validate(req.body, receiveFeedbackSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		if (String(req.body.userId) !== req.params.userId) throw new BadRequestError("Incorrect user ID");

		const entryText = req.body.entryText || "";
		const feedback = await getCompletion(entryText, req.body.journalType, req.body.userId);
		return res.json({ feedback });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
