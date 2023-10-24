"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { getCompletion, generateMessages, configureChatOptions } = require("./prompts");

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
	// test("throws errors if info is missing", async () => {
	// 	try {
	// 		let response = await getCompletion("Hi", "55");
	// 		console.log(response);
	// 	} catch (err) {
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}

	// 	try {
	// 		response = await getCompletion("Hi", "Gratitude Journfdsal", "55");
	// 		console.log(response);
	// 	} catch (err) {
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}
	// 	try {
	// 		response = await getCompletion("", "Gratitude Journal", "55");
	// 		console.log(response);
	// 	} catch (err) {
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}
	// 	try {
	// 		response = await getCompletion(" ", "Gratitude Journal", "55");
	// 		console.log(response);
	// 	} catch (err) {
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}
	// }, 10000);

	test("Works", async () => {
		let response = await getCompletion("Hi", "Gratitude Journal", "55");
		console.log(response);
		expect(typeof response).toBe("string");
		expect(response.split(" ").length).toBeGreaterThan(1);
	}, 15000);

	test("Gratitude Journal", async () => {
		let response = await getCompletion(
			"Hi, I am grateful that my cat is really nice to me and that she is friendly",
			"Gratitude Journal",
			"55"
		);
		console.log(response);
		expect(response).toContain("cat");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
	test("Daily Journal", async () => {
		let response = await getCompletion(
			"Today I went to the gym for the first time. It went better than I expected",
			"Daily Journal",
			"55"
		);
		console.log(response);
		expect(response).toContain("gym");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
	test("Reflective Journal", async () => {
		let response = await getCompletion(
			"When I was a kid, my parents never let me have my own room. Now that I'm an adult I want to have 6 of them.",
			"Reflective Journal",
			"55"
		);
		console.log(response);
		expect(response).toContain("room");
		expect(response).toContain("childhood");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
	test("Stream-of-Consciousness Journal", async () => {
		let response = await getCompletion(
			"Hi, I am blue. I am a melon. I am a gong. I am blue. I am departing. I am blue.",
			"Stream-of-Consciousness Journal",
			"55"
		);
		console.log(response);
		expect(response).toContain("blue");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
	test("Bullet Journal", async () => {
		let response = await getCompletion("-walk the dog -brush my teeth -become the sun", "Bullet Journal", "55");
		console.log(response);
		expect(response).toContain("dog");
		expect(response).toContain("sun");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
	test("Dream Journal", async () => {
		let response = await getCompletion(
			"Hi, in my dream last night, I was eaten by a shark. Then, next thing I knew, I was the shark.",
			"Dream Journal",
			"55"
		);
		console.log(response);
		expect(response).toContain("shark");
		expect(response.length).toBeGreaterThan(750);
	}, 15000);
});
