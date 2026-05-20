
const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");

const authRoutes = require("./routes/auth");
const scooterRoutes = require("./routes/scooters");

const app = express();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scooterbase",
  password: "twoje_haslo",
  port: 5432
});

app.locals.pool = pool;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

app.use(authRoutes);
app.use(scooterRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
