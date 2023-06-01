const userAuthSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "http://example.com/userAuth.json",
	type: "object",
	properties: {
		firstName: { type: "string", minLength: 1 },
		lastName: { type: "string", minLength: 1 },
		email: { type: "string", format: "email" },
		password: { type: "string", minLength: 6 },
		interests: { type: "array", items: { type: "string" } }
	},
	required: ["firstName", "lastName", "email", "password", "interests"],
	additionalProperties: false
};

module.exports = { userAuthSchema };
