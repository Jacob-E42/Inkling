//models/Journal.js

const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { objectDataToSql } = require("../helpers/sql");

class Journal {
	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getById(id) {
		// Define the SQL query
		const query = {
			text: "SELECT * FROM journal_entries WHERE id = $1",
			values: [id]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];

		// If no journal is found, throw an error
		if (!journal) throw new NotFoundError(`No journal with id: ${id}}`);

		// If the journal is found, return it
		return journal;
	}

	// Method to retrieve a journal by its ID
	// Throws a NotFoundError if the journal is not found
	static async getByDate(userId, entryDate) {
		// Define the SQL query
		const query = {
			text: "SELECT * FROM journal_entries WHERE user_id = $1 AND entry_date = $2",
			values: [userId, entryDate]
		};

		// Execute the query
		const res = await db.query(query);
		const journal = res.rows[0];

		// If no journal is found, throw an error
		if (!journal) throw new NotFoundError(`No journal with id: ${id}}`);

		// If the journal is found, return it
		return journal;
	}

	// Method to register a new user
	// Throws a BadRequestError if the email already exists
	static async createEntry(userId, title, entry, entryDate) {
		// Check for existing user
		let existingEntry;
		try {
			existingEntry = await this.getByDate(userId, entryDate);
		} catch (err) {
		} finally {
			if (existingEntry) throw new BadRequestError("A journal entry written on this day already exists");
		}

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
                    RETURNING id, user_id, title, entry_text, entry_date `,
			values: [userId, title, entry, entryDate]
		};

		// Execute the query to insert the new user and return the result
		const res = await db.query(query);
		return res.rows[0];
	}
}

// Export the Journal class
module.exports = Journal;