const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");
const journalCreateSchema = require("../schema/journalCreateSchema");
const journalUpdateSchema = require("../schema/journalUpdateSchema");
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

router.get("/date/:entryDate", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("/journals/date/entryDate GET");
	const { entryDate, userId } = req.params;
	console.log(`Entry date:`, entryDate, `User ID is: ${userId}`);
	try {
		const journal = await Journal.getByDate(userId, entryDate);
		console.log("journals/", journal);
		return res.json({ journal });
	} catch (err) {
		console.log("error=", err);
		const currentDate = new Date().toISOString().slice(0, 10);
		const isToday = currentDate === entryDate;
		if (typeof err === NotFoundError && isToday) {
			console.log("New journal entry is being created");
			return this.createEntry(userId, `Journal Entry: ${entryDate}`, `Start your entry here...`, entryDate);
		}
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
		//desctructure for readability
		const { title, entryText, entryDate } = req.body;
		const userId = req.params.userId;

		// Check for existing user
		let existingEntry;
		try {
			existingEntry = await this.getByDate(userId, entryDate);
		} catch (err) {
		} finally {
			if (existingEntry) throw new BadRequestError("A journal entry written on this day already exists");
		}

		const journal = await Journal.createEntry(userId, title, entryText, entryDate);
		return res.json({ journal });
	} catch (err) {
		return next(err);
	}
});

router.patch("/date/:entryDate", ensureCorrectUserByUserId, async function (req, res, next) {
	console.debug("/journals/date/:entryDate  PATCH");
	const date = req.params.entryDate;
	console.log(date);
	if (!date || typeof date !== "string" || date.length < 10) {
		return next(new BadRequestError("A journal entry date must be provided."));
	}
	console.log("date=", date);
	try {
		// const allReqKeys = { ...req.body, entryDate: req.params.entryDate, userId: Number(req.params.userId) };
		const validator = jsonschema.validate(req.body, journalUpdateSchema);
		console.log(req.body);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		if (req.params.userId !== String(req.body.userId)) {
			throw new NotFoundError("The user id provided doesn't match any known user");
		}
		const { title, entryText, emotions } = req.body;
		const journal = await Journal.updateEntry(req.params.userId, title, entryText, req.params.entryDate, emotions);
		return res.json({ journal });
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

module.exports = router;
