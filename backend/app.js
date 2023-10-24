"use strict";

/** Express app for Inkling. */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const journalRoutes = require("./routes/journals");
const feedbackRoutes = require("./routes/feedback");
const morgan = require("morgan");

// Initialize the Express application
const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/users/:userId/journals", journalRoutes);
app.use("/feedback/:userId", feedbackRoutes);

// Define the root endpoint for the application
app.get("/", async (req, res, next) => {
	try {
		console.debug("app /");
		// Send a welcome message when the root endpoint is accessed
		return res.send(" Inkling - Start journaling and unlock your potential - Sign Up / Log In");
	} catch (err) {
		// Pass any errors to the next middleware for error handling
		next(err);
	}
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
	return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
	if (process.env.NODE_ENV !== "test") console.error(err.stack);
	const status = err.status || 500;
	const message = err.message;
	// console.log("err=", err, "message=", message);
	return res.status(status).json({
		error: { message, status }
	});
});

module.exports = app;
