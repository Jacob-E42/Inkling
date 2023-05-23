"use strict";

describe("config can come from env", function () {
	test("works", function () {
		process.env.SECRET_KEY = "abc";
		process.env.PORT = "5000";
		process.env.DATABASE_URL = "other";
		process.env.NODE_ENV = "other";
		// console.log(process.env);

		process.env.NODE_ENV = "dev";
		const newConfig = require("./config");
		console.log(process.env);
		// expect(newConfig.PORT).toEqual(5000);
		expect(newConfig.getDatabaseUri()).toEqual("other");
		expect(newConfig.BCRYPT_WORK_FACTOR).toEqual(14);
		expect(newConfig.SECRET_KEY).toEqual("abc");

		delete process.env.SECRET_KEY;
		delete process.env.PORT;
		delete process.env.BCRYPT_WORK_FACTOR;
		delete process.env.DATABASE_URL;

		expect(newConfig.getDatabaseUri()).toEqual("inkling");
		process.env.NODE_ENV = "test";

		expect(newConfig.getDatabaseUri()).toEqual("inkling_test");
		process.env.NODE_ENV = "development";
	});
});
