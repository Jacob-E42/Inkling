"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Journal = require("../models/journal");

const { createToken } = require("../helpers/token.js");

async function commonBeforeAll() {
	await db.query("DELETE FROM users");
	await db.query("DELETE FROM journal_entries");

	// reset id sequence
	await db.query("SELECT setval('users_id_seq', 1, false)");
	await db.query("SELECT setval('journal_entries_id_seq', 1, false)");

	await User.register("U1F", "U1L", "user1@user.com", "password1");
	await User.register("U2F", "U2L", "user2@user.com", "password2");
	await User.register("U3F", "U3L", "user3@user.com", "password3");
	await User.register("testfirst", "testlast", "test@test.net", "zoomfoog42");

	await Journal.createEntry(
		1,
		"My birthday",
		"Today was my birthday and I had a great day.",
		"2022-01-04",
		"Gratitude Journaling"
	);
	await Journal.createEntry(
		2,
		"How to be more grateful",
		"I would like to start being more grateful for the little things in life. As part of that I will try to appreciate whatever nice things happen to me unexpectedly.",
		"2023-01-04",
		"Gratitude Journaling"
	);
	await Journal.createEntry(
		3,
		"Habits",
		"Today I did a third of my prescribed habits. Hopefully tomorrow I'll hit the ground running and do better.",
		"2024-01-04",
		"Gratitude Journaling"
	);
	await Journal.createEntry(
		4,
		"Front end",
		"This is a test for the front end, it should be visible there",
		"2023-01-04",
		"Gratitude Journaling"
	);
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

const u1Token = createToken({ email: "user1@user.com" }, 1);
const u2Token = createToken({ email: "user2@user.com" }, 2);
const u3Token = createToken({ email: "user3@user.com" }, 3);
const nonUserToken = createToken({ email: "nosuchuser@user.com" }, 177);

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,

	u1Token,
	u2Token,
	u3Token,
	nonUserToken
};
