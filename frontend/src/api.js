import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class Request {
	constructor() {
		this.token = null;
	}

	async request(endpoint, data = {}, method = "get") {
		console.debug("API Call:", endpoint, data, method);

		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${this.token}` };
		const params = method === "get" ? data : {};

		try {
			return (await axios({ url, method, data, params, headers })).data;
		} catch (err) {
			console.error("API Error:", err, err.response);
			let message = err.data;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// Other specialized request methods

	// Register a new user with the provided username, password, first name, last name, and email
	async signup(data) {
		let response = await this.request("auth/signup", data, "post");
		console.log("response", response);
		return response.token;
	}

	async login(data) {
		const response = await this.request("auth/login", data, "post");
		return response.token;
	}

	async getCurrentUser(email) {
		const response = await this.request("users/", email, "post");
		return response.token;
	}
}

export default Request;
