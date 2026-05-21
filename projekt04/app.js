// ...
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt"); // argon2

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
})); // ...

let users = []; // ...
let scooters = []; // ...
let scooterId = 1; // ...

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

app.get("/", (req, res) => {
  res.render("index", { user: req.session.userId });
});

app.get("/register", (req, res) => res.render("register"));

app.post("/register", async (req, res) => {
  // username, password 
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    username,
    password: hash,
    role: "user"
  });

  res.redirect("/login");
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.redirect("/login");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.redirect("/login"); //

  req.session.userId = user.id;
  req.session.role = user.role;

  res.redirect("/dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/dashboard", requireLogin, (req, res) => {
  let userScooters;

  if (req.session.role === "admin") {
    userScooters = scooters;
  } else {
    userScooters = scooters.filter(s => s.ownerId === req.session.userId);
  }

  res.render("dashboard", { scooters: userScooters });
});

app.get("/scooters/add", requireLogin, (req, res) => {
  res.render("addScooter");
});

app.post("/scooters/add", requireLogin, (req, res) => {
  //
  scooters.push({
    id: scooterId++,
    brand: req.body.brand,
    model: req.body.model,
    engine: req.body.engine,
    year: req.body.year,
    description: req.body.description,
    ownerId: req.session.userId
  });

  res.redirect("/dashboard");
});

app.get("/scooters/edit/:id", requireLogin, (req, res) => {
  const scooter = scooters.find(s => s.id == req.params.id);
  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" &&
      scooter.ownerId !== req.session.userId) {
    return res.send("Brak dostępu");
  }

  res.render("editScooter", { scooter });
});

app.post("/scooters/edit/:id", requireLogin, (req, res) => {
  //
  const scooter = scooters.find(s => s.id == req.params.id);
  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" &&
      scooter.ownerId !== req.session.userId) {
    return res.send("Brak dostępu");
  }

  scooter.brand = req.body.brand;
  scooter.model = req.body.model;
  scooter.engine = req.body.engine;
  scooter.year = req.body.year;
  scooter.description = req.body.description;

  res.redirect("/dashboard");
});

app.post("/scooters/delete/:id", requireLogin, (req, res) => {
  const scooter = scooters.find(s => s.id == req.params.id);
  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" &&
      scooter.ownerId !== req.session.userId) {
    return res.send("Brak dostępu");
  }

  scooters = scooters.filter(s => s.id != req.params.id);
  res.redirect("/dashboard");
});

(async () => {
  // ...
  const hash = await bcrypt.hash("admin123", 10);
  users.push({
    id: 1,
    username: "admin",
    password: hash,
    role: "admin"
  });
})();

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
