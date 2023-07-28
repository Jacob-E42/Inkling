const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");

/**
 * Creates a JWT token from user data
 * @param {object} user - User data object
 * @returns {string} Signed JWT token
 * @throws {BadRequestError} If no user data is provided
 */
function createToken(user) {
	console.debug("createToken");

	if (!user) {
		throw new BadRequestError("User data is missing");
	}

	let payload = {
		email: user.email
	};

	return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
