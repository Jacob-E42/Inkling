"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db");
const { generatePrompt } = require("./prompts");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../models/testUtils");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("generatePrompt", () => {
	test("it exists", () => {
		expect(generatePrompt).toBeDefined();
		expect(typeof generatePrompt).toBe("function");
	});

	test("it returns a string which contains and is longer than the entryText", () => {
		let entryText = "Today was my birthday and I had a great day.";
		let prompt = generatePrompt(entryText);

		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
		expect(prompt).toContain(entryText);

		entryText =
			"I would like to start being more grateful for the little things in life. As part of that I will try to appreciate whatever nice things happen to me unexpectedly.";
		prompt = generatePrompt(entryText);

		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
		expect(prompt).toContain(entryText);

		entryText = "the";
		prompt = generatePrompt(entryText);
		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
		expect(prompt).toContain(entryText);

		entryText = "z";
		prompt = generatePrompt(entryText);
		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
		expect(prompt).toContain(entryText);

		entryText = " ";
		prompt = generatePrompt(entryText);
		expect(typeof prompt).toBe("string");
		expect(prompt.length).toBeGreaterThanOrEqual(entryText.length);
		expect(prompt).toContain(entryText);

		entryText = "";
		prompt = generatePrompt(entryText);

		expect(prompt).toBe(null);
	});
});
