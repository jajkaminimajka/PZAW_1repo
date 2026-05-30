const express       = require("express");
const session       = require("express-session");
const pgSession     = require("connect-pg-simple")(session);
const flash         = require("express-flash");
const csrf          = require("csurf");
const { Pool }      = require("pg");
const argon2        = require("argon2");

const authRoutes    = require("./routes/auth");
const scooterRoutes = require("./routes/scooters");

const app  = express();
const pool = new Pool({
  user:     process.env.PG_USER     || "postgres",
  host:     process.env.PG_HOST     || "localhost",
  database: process.env.PG_DB       || "scooterbase",
  password: process.env.PG_PASSWORD || "twoje_haslo",
  port:     Number(process.env.PG_PORT) || 5432,
});

app.locals.pool = pool;
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  store: new pgSession({ pool, createTableIfMissing: true }),
  secret:            process.env.SESSION_SECRET || "zmien_mnie_na_losowy_string",
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 dni
}));

app.use(flash());

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken  = req.csrfToken();
  res.locals.userId     = req.session.userId;
  res.locals.username   = req.session.username;
  res.locals.role       = req.session.role;
  next();
});

app.use(authRoutes);
app.use(scooterRoutes);

app.get("/", (req, res) => res.render("index"));

async function ensureAdmin() {
  const result = await pool.query(
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
  );
  if (result.rows.length === 0) {
    const hash = await argon2.hash("admin123");
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, 'admin')",
      ["admin", hash]
    );
    console.log("Konto administratora utworzone (login: admin, hasło: admin123)");
    console.log("Zmień hasło administratora po pierwszym logowaniu!");
  }
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(` SkuterBase działa na http://localhost:${PORT}`);
  try {
    await ensureAdmin();
  } catch (err) {
    console.error("Błąd podczas tworzenia admina:", err.message);
  }
});
