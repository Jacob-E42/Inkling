"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db");
const { getCompletion, generateMessages, configureChatOptions } = require("./prompts");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../models/testUtils");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// describe("generateMessages", () => {
// 	test("it exists", () => {
// 		expect(generateMessages).toBeDefined();
// 		expect(typeof generateMessages).toBe("function");
// 	});

// 	test("it returns a response", async () => {
// 		const entryText =
// 			"I would like to start being more grateful for the little things in life. As part of that I will try to appreciate whatever nice things happen to me unexpectedly.";

// 		const response = generateMessages(entryText, "Gratitude Journal");
// 		console.log(response);
// 		expect(response).toBeDefined();
// 		expect(typeof response).toBe("object");
// 	});
// 	test("The message returned is correct", () => {
// 		const entryText =
// 			"I would like to start being more grateful for the little things in life. As part of that I will try to appreciate whatever nice things happen to me unexpectedly.";

// 		const response = generateMessages(entryText, "Gratitude Journal");
// 		// console.log(response);

// 		expect(response.length).toBe(2);
// 		expect(response[0].role).toBeDefined();
// 		expect(response[0].role).toBe("system");
// 		expect(response[0].content).toBeDefined();
// 		expect(response[1].role).toBeDefined();
// 		expect(response[1].role).toBe("user");
// 		expect(response[1].content).toBeDefined();
// 		expect(response[1].content).toBe(entryText);
// 	});
// });

describe("configureChatOptions", () => {
	test("all options are present and properly defined", () => {
		const options = configureChatOptions(`The other day I went to sleep on my bed.`, "Daily Journal", 1);
		expect(options).toBeDefined();

		expect(options.model).toBeOneOf(["gpt-3.5-turbo", "gpt4"]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);
		// expect(options.).oneOf([,]);

		// let presence_penalty = null;
		// let frequency_penalty = 0.2;
		// let max_tokens = 4096;
		// let temperature = 1;
		// let n = 1;
		// let top_p = 0.5;
		// let user = `${userId}`;
	});
});
