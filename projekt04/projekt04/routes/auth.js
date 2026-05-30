
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/register", (req, res) => res.render("register"));

router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1,$2)",
    [username, hash]
  );
  res.redirect("/login");
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res) => {
  const pool = req.app.locals.pool;
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (result.rows.length === 0) return res.redirect("/login");

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.redirect("/login");

  req.session.userId = user.id;
  req.session.role = user.role;
  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
