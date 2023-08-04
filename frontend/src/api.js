import axios from "axios";

class ApiRequest {
	constructor() {
		this.token = null;
		this.BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
	}

	// ask about this
	setToken(token) {
		this.token = token;
	}

	async #request(endpoint, data = {}, method = "get") {
		console.debug("API Call:", endpoint, data, method, this.token);

		const url = `${this.BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${this.token}` };
		const params = method === "get" ? data : {};
		console.log(url, method, data, params, headers);
		try {
			const response = await axios({ url, method, data, params, headers });
			console.log("response", response.data);
			return response.data;
		} catch (error) {
			console.log(error);
			if (error.response) {
				// The request was made, and the server responded with a status code
				// that falls outside the range of 2xx
				console.error(error.response.data); // Here's where you'll find the backend's error message
				const errorMessage = error.response.data.error.message;
				console.log(typeof errorMessage);
				throw errorMessage;
			} else if (error.request) {
				// The request was made, but no response was received
				console.error("No response received:", error.request);
			} else {
				// Something happened in setting up the request that triggered an error
				console.error("Request error:", error.message);
			}
		}
	}

	// Other specialized request methods

	// Register a new user with the provided username, password, first name, last name, and email
	async signup(data) {
		console.debug("API-signup");
		let response = await this.#request("auth/signup", data, "post");
		console.log("response", response);
		return response.token;
	}

	async login(data) {
		console.debug("API-login");
		const response = await this.#request("auth/login", data, "post");
		return response.token;
	}

	async getCurrentUser(email) {
		console.debug("API-getCurrentUser", email);
		const response = await this.#request(`users/${email}`);
		console.log("response", response);
		return response.user;
	}
}

export default ApiRequest;
