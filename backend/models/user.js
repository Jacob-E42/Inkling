// models/User.js

const bcrypt = require("bcrypt");
const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
	// Retrieves a user by their ID
	static async getById(id) {
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
	static async getByEmail(email) {
		const query = {
			text: `SELECT 
					id,
					first_name AS "firstName",
					last_name AS "lastName",
					email, 
					interests FROM users WHERE email = $1`,
			values: [email]
		};

		const res = await db.query(query);
		const user = res.rows[0];
		console.log("User: getByEmail", user);

		if (!user) throw new NotFoundError(`No user with email: ${email}`);
		return user;
	}

	// Registers a new user
	static async register(firstName, lastName, email, password, interests) {
		console.debug("register");

		let existingUser;
		try {
			existingUser = await this.getByEmail(email);
		} catch (err) {
		} finally {
			if (existingUser) throw new BadRequestError("User with this email already exists");
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

	static async authenticate(email, password) {
		console.debug("authenticate");

		const user = await this.getByEmail(email);
		if (!user) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid credentials");
		}

		delete user.password;

		// Return the authenticated user
		return user;
	}

	// Other CRUD methods...
}

module.exports = User;
