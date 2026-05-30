const express = require("express");
const argon2  = require("argon2");
const router  = express.Router();

router.get("/register", (req, res) => {
  res.render("register", { errors: [], old: {} });
});

router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;
  const { username, password, password2 } = req.body;
  const errors = [];
  const old    = { username };

  if (!username || username.trim().length < 3)
    errors.push("Nazwa użytkownika musi mieć co najmniej 3 znaki.");
  if (username && username.trim().length > 50)
    errors.push("Nazwa użytkownika może mieć maksymalnie 50 znaków.");
  if (!/^[a-zA-Z0-9_]+$/.test(username || ""))
    errors.push("Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia.");
  if (!password || password.length < 6)
    errors.push("Hasło musi mieć co najmniej 6 znaków.");
  if (password !== password2)
    errors.push("Hasła nie są identyczne.");

  if (errors.length) return res.render("register", { errors, old });

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1", [username.trim()]
    );
    if (existing.rows.length > 0) {
      errors.push("Ta nazwa użytkownika jest już zajęta.");
      return res.render("register", { errors, old });
    }

    const hash = await argon2.hash(password);
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username.trim(), hash]
    );
    req.flash("success", "Konto zostało utworzone. Możesz się zalogować.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    errors.push("Wystąpił błąd serwera. Spróbuj ponownie.");
    res.render("register", { errors, old });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { errors: [], old: {} });
});

router.post("/login", async (req, res) => {
  const pool = req.app.locals.pool;
  const { username, password } = req.body;
  const errors = [];
  const old    = { username };

  if (!username || !password) {
    errors.push("Wypełnij wszystkie pola.");
    return res.render("login", { errors, old });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1", [username.trim()]
    );

    if (result.rows.length === 0) {
      errors.push("Nieprawidłowa nazwa użytkownika lub hasło.");
      return res.render("login", { errors, old });
    }

    const user  = result.rows[0];
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      errors.push("Nieprawidłowa nazwa użytkownika lub hasło.");
      return res.render("login", { errors, old });
    }

    req.session.userId   = user.id;
    req.session.username = user.username;
    req.session.role     = user.role;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    errors.push("Wystąpił błąd serwera. Spróbuj ponownie.");
    res.render("login", { errors, old });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
