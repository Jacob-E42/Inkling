const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const journalCreateSchema = require("../schema/journalCreateSchema");
const { BadRequestError } = require("../expressError");
const Journal = require("../models/journal");
const { ensureCorrectUser, ensureCorrectUserByEmail } = require("../middleware/authMiddleware");

//ensureCorrectUser as is, is going to lead to errors becuase it only checks for an email param
router.get("/:id", ensureCorrectUserByEmail, async function (req, res, next) {
	console.debug("GET /journals/id ");

	try {
		const journal = await Journal.getById(req.params.id);
		console.log("journals/", journal);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

//ensureCorrectUser as is, is going to lead to errors becuase it only checks for an email param
router.get("/:userId/:entryDate", ensureCorrectUserByEmail, async function (req, res, next) {
	console.debug("GET /journals/userId/entryDate ");

	try {
		const journal = await Journal.getByDate(req.params.userId, req.params.entryDate);
		console.log("journals/", journal);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

router.post("/", ensureCorrectUserByEmail, async function (req, res, next) {
	console.debug("POST /journals/ ");
	try {
		const validator = jsonschema.validate(req.body, journalCreateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const { userId, title, entry, entryDate } = req.body;
		const journal = await Journal.createEntry(userId, title, entry, entryDate);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
