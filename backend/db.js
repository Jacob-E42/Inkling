"use strict";

const knex = require("knex");
const config = require("./knexfile");

// Create a Knex instance for the development environment
const db = knex(config.development);

// Export the Knex instance
module.exports = db;
