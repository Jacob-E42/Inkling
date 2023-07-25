import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class Request {
	constructor(token = null) {
		this.token = token;
	}

	async request(endpoint, data = {}, method = "get") {
		console.debug("API Call:", endpoint, data, method);

		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${this.token}` };
		const params = method === "get" ? data : {};

		try {
			const response = await axios({ url, method, data, params, headers });
			console.log("response", response.data);
			return response.data;
		} catch (err) {
			console.error("API Error:", err);

			throw new Error(err);
		}
	}

	// Other specialized request methods

	// Register a new user with the provided username, password, first name, last name, and email
	async signup(data) {
		console.debug("API-signup");
		let response = await this.request("auth/signup", data, "post");
		console.log("response", response);
		return response.token;
	}

	async login(data) {
		console.debug("API-login");
		const response = await this.request("auth/login", data, "post");
		return response.token;
	}

	async getCurrentUser(email) {
		console.debug("API-getCurrentUser", email);
		const response = await this.request(`users/${email}`, email);
		console.log("response", response);
		return response.token;
	}
}

export default Request;
