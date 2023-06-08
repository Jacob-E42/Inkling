"use strict";

/** Database setup for users. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
	db = new Client({
		connectionString: getDatabaseUri(),
		ssl: {
			rejectUnauthorized: false
		}
	});
} else {
	db = new Client({
		connectionString: getDatabaseUri()
	});
}

db.connect();

db.on("error", err => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

module.exports = db;
