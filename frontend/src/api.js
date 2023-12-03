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
				console.error(error.response.status, error.response.data.error.message || error.response.message); // Here's where you'll find the backend's error message
				const errorMessage = error.response.data.error.message || error.response.message;
				console.warn(errorMessage);
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
		console.log(response);
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
			console.log("Journal->", response);

			return response.journal;
		} catch (err) {
			console.log(err, err.message);
			throw err;
		}
	}

	async createJournalEntry(userId, title, entryText, entryDate) {
		console.debug("createJournalEntry", userId, title, entryText, entryDate);
		let response = await this.#request(`users/${userId}/journals/`, { title, entryText, entryDate }, "post");
		return response.journal;
	}
	async editJournalEntry(userId, title, entryText, entryDate, journalType) {
		console.debug("editJournalEntry", userId, title, entryText, entryDate, journalType);
		const data = {
			userId: userId,
			title: title,
			entryText: entryText,
			entryDate: entryDate,
			journalType: journalType
		};

		let response = await this.#request(`users/${userId}/journals/date/${entryDate}`, data, "patch");
		console.log("editedJournal", response, data);
		return response.journal;
	}
	async getFeedback(id, userId, entryText, journalType, title = null, entryDate = null) {
		console.debug("getFeedback", id, userId, entryText, journalType, title, entryDate);
		const data = {
			id: id,
			userId: userId,
			title: title,
			entryText: entryText,
			entryDate: entryDate,
			journalType: journalType
		};

		let response = await this.#request(`feedback/${userId}/`, data, "post");
		// console.log("response", response);
		return response.feedback;
	}

	async getEmotions(
		id = null,
		userId,
		entryText,
		journalType = null,
		title = null,
		entryDate = null,
		emotions = null
	) {
		console.debug("getEmotions", id, userId, entryText, journalType, title, entryDate, emotions);
		const data = {
			id: id,
			userId: userId,
			title: title,
			entryText: entryText,
			entryDate: entryDate,
			journalType: journalType,
			emotions: emotions
		};

		let response = await this.#request(`emotions/${userId}/`, data, "post");
		// console.log("emotions=", response);
		return response.emotions;
	}
}

export default ApiRequest;
