"use strict";

const app = require("./app");
const { PORT } = require("./config");

//start server on port specified in env variable
app.listen(PORT, function () {
	console.log(`Started on http://localhost:${PORT}`);
});
