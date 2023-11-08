//models/Journal.js

const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError, ExpressError } = require("../expressError");
const { objectDataToSql } = require("../helpers/sql");
const { isDate, parseISO } = require("date-fns");
const formatJournalDate = require("../helpers/formatJournalDate");

class Journal {
	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getById(id) {
		// Define the SQL query
		const query = {
			text: `SELECT id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions, journal_type AS "journalType" FROM journal_entries WHERE id = $1`,
			values: [id]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];

		// If no journal is found, throw an error
		if (!journal) throw new NotFoundError(`No journal with id: ${id}`);

		// If the journal is found, return it
		return formatJournalDate(journal);
	}

	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getByDate(userId, entryDate) {
		// console.debug("getByDate", userId, entryDate);

		// Define the SQL query
		const query = {
			text: `SELECT id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions, journal_type AS "journalType" FROM journal_entries WHERE user_id = $1 AND entry_date = $2`,
			values: [userId, entryDate]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];
		// console.log("journal=", journal);

		if (!journal) {
			console.log(`No journal with date: ${entryDate}`);
			throw new NotFoundError(`Error: No journal with date: ${entryDate}`);
		} else {
			console.log("journal found");
			// If the journal is found, return it
			return formatJournalDate(journal);
		}
	}

	static async getDatesRange(userId, dateRange) {
		console.debug("getDatesRange", userId, dateRange);
		let journalsByDate = [];

		for (let date of dateRange) {
			let journalByDate = { date, exists: false };
			if (!isDate(parseISO(date))) {
				journalByDate.date = false;
				exists = false;
				continue;
			}
			let resp;
			try {
				resp = await this.getByDate(userId, date);
			} catch (err) {
			} finally {
				console.debug("resp", resp);
				if (resp && resp.id && resp.entryDate === date) journalByDate.exists = true;
			}

			journalsByDate.push(journalByDate);
		}

		if (journalsByDate.length !== dateRange.length)
			return new ExpressError("One or more of the dates wasn't handled correctly", 500);
		console.debug(journalsByDate);
		return journalsByDate;
	}
	// Method to register a new user
	// Throws a BadRequestError if the email already exists
	static async createEntry(userId, title, entry, entryDate, journalType) {
		// console.log("createEntry entryText=", entry);

		// Define the SQL query to insert the new journal
		const query = {
			text: `INSERT INTO journal_entries (user_id, title, entry_text, entry_date, journal_type)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", journal_type AS "journalType"`,
			values: [userId, title, entry, entryDate, journalType]
		};

		// Execute the query to insert the new user and return the result
		const res = await db.query(query);

		// console.log(res.rows[0]);
		return formatJournalDate(res.rows[0]);
	}

	static async updateEntry(userId, title, entryText, entryDate, emotions = null, journalType) {
		console.debug(
			"updateEntry",
			"userId=",
			userId,
			"title=",
			title,
			"entryText=",
			entryText,
			"entryDate=",
			entryDate,
			"emotions=",
			emotions,
			"journalType=",
			journalType
		);
		if (!(userId && title && entryText && entryDate && journalType)) {
			throw new BadRequestError("Required information is missing");
		}
		// First, check to see if the journal entry exists for the given date and user ID
		let existingEntry;
		try {
			existingEntry = await this.getByDate(userId, entryDate);
		} catch (err) {
			console.error(err);
			if (err instanceof NotFoundError) throw err;
		}

		// Define the SQL query to update the existing journal entry
		const query = {
			text: `UPDATE journal_entries 
				   SET title = $1, entry_text = $2, emotions = $3, journal_type = $4
				   WHERE user_id = $5 AND entry_date = $6
				   RETURNING id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions, journal_type AS "journalType"`,
			values: [title, entryText, emotions, journalType, userId, entryDate]
		};

		// Execute the query to update the journal entry and return the result
		const res = await db.query(query);

		if (res.rows.length === 0) {
			throw new Error("Could not update journal entry");
		}
		// console.log(res.rows[0].journalType);
		return formatJournalDate(res.rows[0]);
	}
}

// Export the Journal class
module.exports = Journal;
