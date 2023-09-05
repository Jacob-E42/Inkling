import axios from "axios";
import ApiError from "./ApiError";

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

				throw new ApiError(errorMessage, error.response.status);
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

	// Register a new user with the provided email, password, first name, last name, and email
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

	// Edit the current user's information based on the provided email and data
	async editCurrentUser(email, data) {
		console.debug("editCurrentUser", email, data);
		let response = await this.#request(`users/${email}`, data, "patch");
		return response.user;
	}

	async getJournalEntryById(userId, journalId) {
		console.debug("getJournalEntryById", userId, journalId);
		let response = await this.#request(`users/${userId}/journals/${journalId}`);
		return response.journal;
	}

	async getJournalEntryByDate(userId, date) {
		console.debug("getJournalEntryByDate", userId, date);
		if (!userId || !date) throw Error("Either userId or date is missing");
		try {
			let response = await this.#request(`users/${userId}/journals/date/${date}`);
			console.log(response);
			return response.journal;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async createJournalEntry(userId, title, entryText, entryDate) {
		console.debug("createJournalEntry", userId, title, entryText, entryDate);
		let response = await this.#request(`users/${userId}/journals/`, { title, entryText, entryDate }, "post");
		return response.journal;
	}
	async editJournalEntry(userId, title, entryText, entryDate, emotions = null) {
		console.debug("editJournalEntry", userId, title, entryText, entryDate, emotions);
		const data = { userId: userId, title: title, entryText: entryText, entryDate: entryDate, emotions: emotions };
		console.log("1st log", data);
		let response = await this.#request(`users/${userId}/journals/date/${entryDate}`, data, "patch");
		console.log("2nd log", data, response);
		return response.journal;
	}
}

export default ApiRequest;
