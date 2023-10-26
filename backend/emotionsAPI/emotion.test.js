"use strict";

const { BadRequestError } = require("../expressError");

const { getNLU } = require("./path_to_your_NLU_file"); // Update the path accordingly
const { BadRequestError } = require("../expressError");

describe("getNLU", () => {
	test("it exists", async () => {
		expect(getNLU).toBeDefined();
		expect(typeof getNLU).toBe("function");
	});

	test("throws errors if info is missing", async () => {
		try {
			await getNLU("");
		} catch (err) {
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

		// Check that the response has the emotion data. Modify according to actual response structure
		expect(response).toHaveProperty("emotion");
		expect(response.emotion).toHaveProperty("document");
		expect(response.emotion.document.emotion).toHaveProperty("joy");
	});

	// ... Add more tests based on other features of the NLU response.
});
