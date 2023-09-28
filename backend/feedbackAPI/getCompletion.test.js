"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db");
const { getCompletion } = require("./prompts");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../models/testUtils");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("generatePrompt", () => {
	test("it exists", () => {
		expect(getCompletion).toBeDefined();
		expect(typeof getCompletion).toBe("function");
	});

	test("it returns a response", async () => {
		const entryText =
			"I would like to start being more grateful for the little things in life. As part of that I will try to appreciate whatever nice things happen to me unexpectedly.";

		const response = await getCompletion(entryText);
		// console.log(response);
		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
	});
});
