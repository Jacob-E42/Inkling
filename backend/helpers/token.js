const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");

/**
 * Creates a JWT token from user data
 * @param {object} user - User data object
 * @returns {string} Signed JWT token
 * @throws {BadRequestError} If no user data is provided
 */
function createToken(user, userId) {
	// console.debug("createToken", "user=", user);

	if (!user || !userId || !user.email) {
		throw new BadRequestError("User data is missing or incomplete");
	}

	let payload = {
		id: userId,
		email: user.email
	};

	return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
