"use strict";
process.env.NODE_ENV = "dev";
const config = require("./config");

describe("Config", () => {
	it("should have a valid SECRET_KEY", () => {
		expect(config.SECRET_KEY).toBeDefined();
		expect(config.SECRET_KEY).toEqual("secret-dev");
		expect(typeof config.SECRET_KEY).toBe("string");
	});

	it("should have a valid PORT", () => {
		expect(config.PORT).toBeDefined();
		expect(config.PORT).toEqual(3001);
		expect(typeof config.PORT).toBe("number");
	});

	it("should have a valid BCRYPT_WORK_FACTOR", () => {
		const BCRYPT_WORK_FACTOR = config.BCRYPT_WORK_FACTOR;
		expect(BCRYPT_WORK_FACTOR).toBeDefined();
		expect(BCRYPT_WORK_FACTOR).toEqual(14);
		expect(typeof config.BCRYPT_WORK_FACTOR).toBe("number");
	});

	it("should have a valid database URI", () => {
		const databaseUri = config.getDatabaseUri();
		expect(databaseUri).toBeDefined();
		expect(databaseUri).toEqual("inkling");
		expect(typeof databaseUri).toBe("string");
	});
	afterAll(() => {
		// Reset the environment variables to their original values
		process.env.SECRET_KEY = config.SECRET_KEY;
		process.env.PORT = config.PORT.toString();
		process.env.DATABASE_URL = ""; // Set to empty to test fallback value
		process.env.NODE_ENV = "";
	});
});

// describe("config can come from env", function () {
// 	const config = require("./config");
// 	test("works", function () {
// 		process.env.SECRET_KEY = "abc";
// 		process.env.PORT = "5000";
// 		process.env.DATABASE_URL = "other";
// 		process.env.NODE_ENV = "other";

// 		expect(config.SECRET_KEY).toEqual("abc");
// 		expect(config.PORT).toEqual(5000);
// 		expect(config.getDatabaseUri()).toEqual("other");
// 		expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

// 		delete process.env.SECRET_KEY;
// 		delete process.env.PORT;
// 		delete process.env.BCRYPT_WORK_FACTOR;
// 		delete process.env.DATABASE_URL;

// 		expect(config.getDatabaseUri()).toEqual("inkling");
// 		process.env.NODE_ENV = "test";

// 		expect(config.getDatabaseUri()).toEqual("inkling_test");
// 		process.env.NODE_ENV = "development";
// 	});
// });
