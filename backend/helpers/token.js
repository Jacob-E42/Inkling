const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");

/** return signed JWT from user data. */

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
