import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class Request {
	constructor(authToken) {
		this.authToken = authToken;
	}

	async request(endpoint, data = {}, method = "get") {
		console.debug("API Call:", endpoint, data, method);

		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${this.authToken}` };
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

	// Other specialized request methods can be added here
	// For example, methods like get, post, put, delete, etc.
}

export default Request;
