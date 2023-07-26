"use strict";

import Request from "../api";

async function commonBeforeAll() {
	let request = new Request();
	await request.register("U1F", "U1L", "request1@request.com", "password1", ["interest1", "interest2"]);

	await request.register("U1F", "U1L", "request1@request.com", "password1", ["interest1", "interest2"]);
	await request.register("U2F", "U2L", "request2@request.com", "password2", ["interest2", "interest3"]);
	await request.register("U3F", "U3L", "request3@request.com", "password3", ["interest1", "interest3"]);
}

export { commonBeforeAll };
