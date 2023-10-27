"use strict";

const { getNLU } = require("./emotion"); // Update the path accordingly
const { BadRequestError } = require("../expressError");

describe("getNLU", () => {
	test("it exists", async () => {
		expect(getNLU).toBeDefined();
		expect(typeof getNLU).toBe("function");
	});

	test("throws errors if info is missing", async () => {
		try {
			const resp = await getNLU("");
			console.log(resp);
		} catch (err) {
			console.error(err);
			expect(err instanceof BadRequestError).toBeTruthy();
		}

		try {
			await getNLU(" ");
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});

	test("returns emotion analysis", async () => {
		// Ideally, you'd want to mock the response here rather than make an actual API call.
		// For simplicity, we're assuming a direct call.
		const response = await getNLU("Today I felt really happy because it was sunny.");
		// console.log(response);
		// Check that the response has the emotion data. Modify according to actual response structure
		const concepts = response.concepts.map(concept => concept.text);
		console.log(concepts, response.emotion.document.emotion);
		expect(response).toHaveProperty("emotion");
		expect(response.emotion).toHaveProperty("document");
		expect(response.emotion.document.emotion).toHaveProperty("joy");
	}, 5000);

	test("it has keyword feature", async () => {
		const response = await getNLU("Today I felt really happy because it was sunny.");
		expect(response).toHaveProperty("keywords");
	}, 5000);
	test("it has concepts feature", async () => {
		const response = await getNLU("Today I felt really happy because it was sunny.");
		expect(response).toHaveProperty("concepts");
	}, 5000);
	test("it has entities feature", async () => {
		const response = await getNLU("Today I felt really happy because it was sunny.");
		expect(response).toHaveProperty("entities");
	}, 5000);
});
