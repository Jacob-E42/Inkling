"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db");
const { generateSystemMessage } = require("./generateSystemMessage");
// The following imports are utility functions for Jest to manage the database state before and after tests
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../models/testUtils");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("generateSystemMessage", () => {
	test("it exists", () => {
		expect(generateSystemMessage).toBeDefined();
		expect(typeof generateSystemMessage).toBe("function");
	});

	test("it returns a message that has the default text", () => {
		let journalType = "Daily Journal";
		let message = generateSystemMessage(journalType);

		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain("You are a helpful assistant");
		expect(message).toContain("Please be friendly");
	});

	test("it returns a string which contains and is longer than the journalType", () => {
		let journalType = "Daily Journal";
		let message = generateSystemMessage(journalType);

		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);
		expect(message).toContain("daily log");

		journalType = "Dream Journal";
		message = generateSystemMessage(journalType);

		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);
		expect(message).toContain("their dreams");

		journalType = "Gratitude Journal";
		message = generateSystemMessage(journalType);
		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);
		expect(message).toContain("they are grateful for");

		journalType = "Stream-of-Consciousness Journal";
		message = generateSystemMessage(journalType);
		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain("Stream of Consciousness Journal");
		expect(message).toContain("as they come to mind");

		journalType = "Reflective Journal";
		message = generateSystemMessage(journalType);
		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);
		expect(message).toContain("records and analyzes");

		journalType = "Bullet Journal";
		message = generateSystemMessage(journalType);
		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);
		expect(message).toContain("journal technique");
	});

	test("it handles empty strings", () => {
		let journalType = " ";
		let message = generateSystemMessage(journalType);
		expect(typeof message).toBe("string");
		expect(message.length).toBeGreaterThanOrEqual(journalType.length);
		expect(message).toContain(journalType);

		journalType = "";
		message = generateSystemMessage(journalType);

		expect(message).toBe(null);
	});
});
