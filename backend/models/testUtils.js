"use strict";

const db = require("../db.js");
const User = require("../models/user");

const { createToken } = require("../helpers/token.js");

const testJobIds = [];

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM users");

	// reset id sequence
	await db.query("SELECT setval('users_id_seq', 1, false)");

	await User.register("U1F", "U1L", "user1@user.com", "password1", ["interest1", "interest2"]);
	await User.register("U2F", "U2L", "user2@user.com", "password2", ["interest2", "interest3"]);
	await User.register("U3F", "U3L", "user3@user.com", "password3", ["interest1", "interest3"]);
}

async function commonBeforeEach() {
	await db.query("BEGIN");
}

async function commonAfterEach() {
	await db.query("ROLLBACK");
}

async function commonAfterAll() {
	// End the database connection
	try {
		await db.end();
		console.log("Database connection closed");
	} catch (err) {
		console.error("Error closing database connection:", err);
	}
}

const u1Token = createToken({ email: "user1@user.com" });
const u2Token = createToken({ email: "user2@user.com" });
const u3Token = createToken({ email: "user3@user.com" });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,

	u1Token,
	u2Token,
	u3Token
};
