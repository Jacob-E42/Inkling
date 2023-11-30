"use strict";

/** Shared config for application; can be required many places. */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
	return process.env.NODE_ENV === "test"
		? "postgresql:///inkling_test"
		: process.env.DATABASE_URL || "postgresql:///inkling";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 14;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "openaikey";
const IBM_API_KEY = process.env.IBM_API_KEY || "ibmkey";
const IBM_URL = process.env.IBM_URL || "ibmurl";

console.log("inkling Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("OPENAI_API_KEY".yellow, OPENAI_API_KEY);
console.log("IBM_API_KEY".yellow, IBM_API_KEY);
console.log("IBM_URL".yellow, IBM_URL);
console.log("---");

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri,
	OPENAI_API_KEY,
	IBM_API_KEY,
	IBM_URL
};
