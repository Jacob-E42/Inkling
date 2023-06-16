import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class Request {
	constructor(token = "") {
		this.token = token;
	}

	async request(endpoint, data = {}, method = "get") {
		console.debug("API Call:", endpoint, data, method);

		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${this.aoken}` };
		const params = method === "get" ? data : {};

		try {
			const response = await axios({
				url,
				method,
				data,
				params,
				headers
			});

			return response.data;
		} catch (err) {
			console.error("API Error:", err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// Other specialized request methods

	// Register a new user with the provided username, password, first name, last name, and email
	async signup(data) {
		let response = await this.request("auth/signup", data, "post");
		return response.token;
	}

	async login(data) {
		const response = await this.request("auth/login", data, "post");
		return response.token;
	}
}

export default Request;
