//models/Journal.js

const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { objectDataToSql } = require("../helpers/sql");
const formatJournalDate = require("../helpers/formatJournalDate");

class Journal {
	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getById(id) {
		// Define the SQL query
		const query = {
			text: `SELECT id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions FROM journal_entries WHERE id = $1`,
			values: [id]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];

		// If no journal is found, throw an error
		if (!journal) throw new NotFoundError(`No journal with id: ${id}}`);

		// If the journal is found, return it
		return formatJournalDate(journal);
	}

	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getByDate(userId, entryDate, isToday) {
		console.debug("getByDate", userId, entryDate, isToday);
		// Define the SQL query
		const query = {
			text: `SELECT id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions FROM journal_entries WHERE user_id = $1 AND entry_date = $2`,
			values: [userId, entryDate]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];
		console.log("journal=", journal);

		// If no journal is found, throw an error
		if (!journal && isToday) {
			console.log("New journal entry is being created");
			return formatJournalDate(this.createEntry(userId, "", "", entryDate));
		} else if (!journal) {
			throw new NotFoundError(`No journal with id: ${userId}`);
		} else {
			console.log("else clause");
			// If the journal is found, return it
			return formatJournalDate(journal);
		}
	}

	// Method to register a new user
	// Throws a BadRequestError if the email already exists
	static async createEntry(userId, title, entry, entryDate) {
		console.log("createEntry entryText=", entry);
		// Check for existing user
		let existingEntry;
		try {
			existingEntry = await this.getByDate(userId, entryDate);
		} catch (err) {
		} finally {
			if (existingEntry) throw new BadRequestError("A journal entry written on this day already exists");
		}

		// console.log("entry date=", entryDate);

		// // Define the new user object
		// const newUser = {
		// 	first_name: firstName,
		// 	last_name: lastName,
		// 	email,
		// 	password: hashedPassword,
		// 	interests
		// };

		// Define the SQL query to insert the new journal
		const query = {
			text: `INSERT INTO journal_entries (user_id, title, entry_text, entry_date)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, user_id AS "userId", title, entry_text AS "entryText", entry_date AS "entryDate", emotions `,
			values: [userId, title, entry, entryDate]
		};

		// Execute the query to insert the new user and return the result
		const res = await db.query(query);

		// console.log(res);
		return formatJournalDate(res.rows[0]);
	}
}

// Export the Journal class
module.exports = Journal;
