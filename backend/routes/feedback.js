const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const receiveFeedbackSchema = require("../schema/receiveFeedbackSchema.json");
const { BadRequestError, NotFoundError } = require("../expressError");
const { generatePrompt, getCompletion } = require("../feedbackAPI/prompts");
const {
	ensureCorrectUser,
	ensureCorrectUserByEmail,
	ensureLoggedIn,
	ensureCorrectUserByUserId
} = require("../middleware/authMiddleware");

router.post("/", ensureLoggedIn, async function (req, res, next) {
	console.debug("POST /feedback/ ");

	try {
		const validator = jsonschema.validate(req.body, receiveFeedbackSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		// if (req.params.userId !== String(req.body.userId)) {
		// 	throw new NotFoundError("The user id provided doesn't match any known user");
		// }
		//desctructure for readability
		const entryText = req.body.entryText || "";
		const feedback = await getCompletion(entryText);
		return res.json({ feedback });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
