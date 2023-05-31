// models/User.js

const bcrypt = require("bcrypt");
const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
	constructor() {
		this.db = db;
		this.tableName = "users";
	}

	// Retrieves a user by their ID
	async getById(id) {
		return this.db(this.tableName).where({ id }).first();
	}

	// Retrieves a user by their email
	async getByEmail(email) {
		return this.db(this.tableName).where({ email }).first();
	}

	// Registers a new user
	async register(firstName, lastName, email, password, interests) {
		// Check if user with the same email already exists
		const existingUser = await this.getByEmail(email);
		if (existingUser) {
			throw new BadRequestError("User with this email already exists");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, bcr);

		// Insert new user into the database
		const newUser = {
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashedPassword,
			interests
		};
		const result = await this.db(this.tableName)
			.insert(newUser)
			.returning(["first_name", "last_name", "email", "interests"]);

		// Return the newly created user
		return result[0];
	}

	// Other CRUD methods...
}

module.exports = User;