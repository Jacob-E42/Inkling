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
		const res = await this.db("users").select("*").where({ id: id }).first();
		console.log(res);
		return res;
	}

	// Retrieves a user by their email
	async getByEmail(email) {
		return await this.db(this.tableName).select().where({ email }).first();
	}

	// Registers a new user
	async register(firstName, lastName, email, password, interests) {
		console.debug("User.register");
		// Check if user with the same email already exists
		const existingUser = await this.getByEmail(email);
		if (existingUser) {
			throw new BadRequestError("User with this email already exists");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		// Insert new user into the database
		const newUser = {
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashedPassword,
			interests
		};

		const result = await this.db("users")
			.insert(newUser)
			.returning(["first_name", "last_name", "email", "interests"]);

		// Return the newly created user
		return result[0];
	}

	// Other CRUD methods...
}

module.exports = User;
