
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scooterbase",
  password: "twoje_haslo",
  port: 5432
});

(async () => {
  const hash = await bcrypt.hash("admin123", 10);
  await pool.query(
    "INSERT INTO users (username, password, role) VALUES ($1,$2,'admin')",
    ["admin", hash]
  );
  console.log("Admin created");
  process.exit();
})();
