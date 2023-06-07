"use strict";

/** Database setup for users. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db = new Client({
	connectionString: getDatabaseUri()
});

await db.connect();

module.exports = db;
