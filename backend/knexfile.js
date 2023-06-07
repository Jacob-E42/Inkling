// knexfile.js

module.exports = {
	development: {
		client: "postgresql",
		connection: {
			database: "inkling"
			// Add other connection details such as host, username, password if needed
		},
		migrations: {
			directory: __dirname + "/db/migrations"
		},
		seeds: {
			directory: __dirname + "/db/seeds"
		}
	},
	test: {
		client: "postgresql",
		connection: {
			database: "inkling_test"
			// Add other connection details such as host, username, password if needed
		},
		migrations: {
			directory: __dirname + "/db/migrations"
		},
		seeds: {
			directory: __dirname + "/db/seeds"
		},
		debug: true
	}
};
