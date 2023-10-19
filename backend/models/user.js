// models/User.js

// Import necessary dependencies
const bcrypt = require("bcrypt");
const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { objectDataToSql } = require("../helpers/sql");

// Define the User class
class User {
	// Method to retrieve a user by their ID
	// Throws a NotFoundError if the user is not found
	static async getById(id) {
		// Define the SQL query
		const query = {
			text: "SELECT * FROM users WHERE id = $1",
			values: [id]
		};

		// Execute the query
		const res = await db.query(query);
		const user = res.rows[0];

		// If no user is found, throw an error
		if (!user) throw new NotFoundError(`No user with id: ${id}}`);

		// If the user is found, return it
		return user;
	}

	// Method to retrieve a user by their email
	// Throws a NotFoundError if the user is not found
	static async getByEmail(email) {
		// Define the SQL query
		const query = {
			text: `SELECT 
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
                    FROM users WHERE email = $1`,
			values: [email]
		};

		// Execute the query
		const res = await db.query(query);
		const user = res.rows[0];

		// If no user is found, throw an error
		if (!user) throw new NotFoundError(`No user with email: ${email}`);

		// If the user is found, return it
		return user;
	}

	// Method to register a new user
	// Throws a BadRequestError if the email already exists
	static async register(firstName, lastName, email, password) {
		// Check for existing user
		let existingUser;
		try {
			existingUser = await this.getByEmail(email);
		} catch (err) {
		} finally {
			if (existingUser) throw new BadRequestError("User with this email already exists");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		// Define the new user object
		const newUser = {
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashedPassword
		};

		// Define the SQL query to insert the new user
		const query = {
			text: `INSERT INTO users (first_name, last_name, email, password)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, first_name, last_name, email`,
			values: [newUser.first_name, newUser.last_name, newUser.email, newUser.password]
		};

		// Execute the query to insert the new user and return the result
		const res = await db.query(query);
		return res.rows[0];
	}

	// Method to authenticate a user
	// Throws an UnauthorizedError if the email or password is incorrect
	static async authenticate(email, password) {
		// Define the SQL query
		const query = {
			text: `SELECT 
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    password,
                    email 
					FROM users WHERE email = $1`,
			values: [email]
		};

		// Execute the query
		const res = await db.query(query);
		const user = res.rows[0];

		// If no user is found, throw an error
		if (!user) {
			throw new UnauthorizedError("Invalid credentials");
		}

		// Check if the password is correct
		const isPasswordValid = await bcrypt.compare(password, user.password);
		// If the password is incorrect, throw an error
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid credentials");
		}

		// Delete the password property from the user object
		delete user.password;

		// Return the authenticated user
		return user;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include:
	 *   { firstName, lastName, password, email, interests }
	 *
	 * Returns { email, firstName, lastName, interests }
	 *
	 * Throws NotFoundError if not found.
	 *
	 * WARNING: this function can set a new password.
	 * Callers of this function must be certain they have validated inputs to this
	 * or a serious security risks are opened.
	 */

	static async update(email, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = objectDataToSql(data);
		const emailVarIdx = "$" + (values.length + 1);

		const query = {
			text: `UPDATE users 
						  SET ${setCols} 
						  WHERE email = ${emailVarIdx} 
						  RETURNING 
									first_name AS "firstName",
									last_name AS "lastName",
									email`,
			values: [...values, email]
		};

		const result = await db.query(query);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user with email: ${email}`);

		delete user.password;
		return user;
	}

	/** Delete given user from database; returns undefined. */

	//   static async remove(email) {
	// 	let result = await db.query(
	// 		  `DELETE
	// 		   FROM users
	// 		   WHERE email = $1
	// 		   RETURNING email`,
	// 		[email],
	// 	);
	// 	const user = result.rows[0];

	// 	if (!user) throw new NotFoundError(`No user: ${email}`);
	//   }
}

// Export the User class
module.exports = User;
