"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
// const db = require("../db");
const { getCompletion, generateMessages, configureChatOptions } = require("./prompts");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../models/testUtils");

// Setting up hooks to manage the database state before and after tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// describe("generateMessages", () => {
// 	test("it exists", async () => {
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
// 	test("The message returned is correct", async () => {
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

// describe("configureChatOptions", () => {
// 	test("all options are present and properly defined", async () => {
// 		const options = configureChatOptions(`The other day I went to sleep on my bed.`, "Daily Journal", 1);
// 		expect(options).toBeDefined();

// 		expect(options.model).toBeOneOf(["gpt-3.5-turbo", "gpt4"]);
// 		expect(options.presence_penalty).toBeOneOf([0.2, null]);
// 		expect(options.frequency_penalty).toBeOneOf([0.2, null, 0]);
// 		expect(options.max_tokens).toBeOneOf([4096, 4000, 3750, 3500, 3000]);
// 		expect(options.temperature).toBeOneOf([1, 1.5]);
// 		expect(options.n).toBeOneOf([1, 2]);
// 		expect(options.top_p).toBeOneOf([0.5, 1]);
// 		console.log(options.user, typeof options.user);
// 		expect(Number(options.user)).toBeNumber();
// 		expect(options.messages).toBeDefined();
// 	});
// });

describe("getCompletion", () => {
	test("throws errors if info is missing", async () => {
		let response = await getCompletion("Hi", "Gratitude Journal", "55");
		console.log(response);
		expect(response).toBeDefined();

		try {
			response = await getCompletion("Hi", "55");
			console.log(response);
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}

		try {
			response = await getCompletion("Hi", "Gratitude Journfdsal", "55");
			console.log(response);
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
		try {
			response = await getCompletion("", "Gratitude Journal", "55");
			console.log(response);
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
		try {
			response = await getCompletion(" ", "Gratitude Journal", "55");
			console.log(response);
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	}, 10000);
});
