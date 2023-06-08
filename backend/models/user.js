// models/User.js

const bcrypt = require("bcrypt");
const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
	// Retrieves a user by their ID
	async getById(id) {
		const query = {
			text: "SELECT * FROM users WHERE id = $1",
			values: [id]
		};

		const res = await db.query(query);
		const user = res.rows[0];

		if (!user) throw new NotFoundError(`No user with id: ${id}}`);

		return user;
	}

	// Retrieves a user by their email
	async getByEmail(email) {
		const query = {
			text: "SELECT * FROM users WHERE email = $1",
			values: [email]
		};

		const res = await db.query(query);
		const user = res.rows[0];

		if (!user) return null;
		return user;
	}

	// Registers a new user
	async register(firstName, lastName, email, password, interests) {
		console.debug("User.register");

		const existingUser = await this.getByEmail(email);
		if (existingUser) {
			throw new BadRequestError("User with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const newUser = {
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashedPassword,
			interests
		};

		const query = {
			text: `INSERT INTO users (first_name, last_name, email, password, interests)
				 VALUES ($1, $2, $3, $4, $5)
				 RETURNING first_name, last_name, email, interests`,
			values: [newUser.first_name, newUser.last_name, newUser.email, newUser.password, newUser.interests]
		};

		const res = await db.query(query);
		return res.rows[0];
	}

	// Other CRUD methods...
}

module.exports = User;
