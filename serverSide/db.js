const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fitness_planner",
  password: "aviv20yair97",
  port: 5432,
});

module.exports = pool;