const request = require("supertest");
const app = require("./app");
const db = require("./db");

describe("App", () => {
	it("GET / should return the homepage", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
		expect(response.text).toContain("Inkling");
		expect(response.text).toContain("Start journaling and unlock your potential");
		expect(response.text).toContain("Sign Up / Log In");
	});
});

test("not found for site 404", async () => {
	const resp = await request(app).get("/no-such-path");
	expect(resp.statusCode).toEqual(404);
});

test("not found for site 404 (test stack print)", async () => {
	process.env.NODE_ENV = "";
	const resp = await request(app).get("/no-such-path");
	expect(resp.statusCode).toEqual(404);
	delete process.env.NODE_ENV;
});

//db.end() is not a function
afterAll(function () {
	db.end();
});
