const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const journalCreateSchema = require("../schema/journalCreateSchema");
const { BadRequestError, NotFoundError } = require("../expressError");
const Journal = require("../models/journal");
const {
	ensureCorrectUser,
	ensureCorrectUserByEmail,
	ensureLoggedIn,
	ensureCorrectUserByUserId
} = require("../middleware/authMiddleware");

//ensureCorrectUser as is, is going to lead to errors becuase it only checks for an email param
router.get("/:journalId", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("GET /journals/id ");
	// console.log(`User ID is: ${req.params.userId}`);
	try {
		const journal = await Journal.getById(req.params.journalId);
		console.log("journals/", journal);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

//ensureCorrectUser as is, is going to lead to errors becuase it only checks for an email param
router.get("/date/:entryDate", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("/journals/entryDate GET");
	console.log(`Entry date:`, req.params.entryDate, `User ID is: ${req.params.userId}`, "isToday=", req.query.isToday);
	try {
		const journal = await Journal.getByDate(req.params.userId, req.params.entryDate, req.query.isToday);
		console.log("journals/", journal);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

router.post("/", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("POST /journals/ ");

	try {
		const validator = jsonschema.validate(req.body, journalCreateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		if (req.params.userId !== String(req.body.userId)) {
			throw new NotFoundError("The user id provided doesn't match any known user");
		}
		const { title, entryText, entryDate } = req.body;
		const journal = await Journal.createEntry(req.params.userId, title, entryText, entryDate);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
