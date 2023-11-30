export default class ApiError extends Error {
	constructor(message, status) {
		super(message); // Call the constructor of the Error class
		this.message = message;
		this.status = status;
		this.name = "ApiError"; // This can be useful for error handling later on
	}
}

// Usage:
// throw new ApiError(errorMessage, error.response.status);
