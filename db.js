const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2306",
  port: 5433,
  database: "demo"
});

module.exports = pool;