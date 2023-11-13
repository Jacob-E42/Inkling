const jwt = require("jsonwebtoken");
const { createToken } = require("./token");
const { SECRET_KEY } = require("../config");

describe("createToken", () => {
	const user = {
		email: "test@example.com"
	};

	it("should create a valid JWT token", () => {
		const token = createToken(user, 1);
		expect(token).toBeDefined();

		// Verify the token using the secret key
		const decoded = jwt.verify(token, SECRET_KEY);
		expect(decoded.email).toEqual(user.email);
	});

	it("should throw an error if user data is missing", () => {
		expect(() => createToken()).toThrowError("User data is missing");
	});
});
