
const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

router.get("/dashboard", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;
  let result;

  if (req.session.role === "admin") {
    result = await pool.query("SELECT * FROM scooters");
  } else {
    result = await pool.query(
      "SELECT * FROM scooters WHERE owner_id=$1",
      [req.session.userId]
    );
  }

  res.render("dashboard", { scooters: result.rows });
});

router.get("/scooters/add", requireLogin, (req, res) => {
  res.render("addScooter");
});

router.post("/scooters/add", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;
  const { brand, model, engine_capacity, year, description } = req.body;

  await pool.query(
    `INSERT INTO scooters 
    (brand, model, engine_capacity, year, description, owner_id)
    VALUES ($1,$2,$3,$4,$5,$6)`,
    [brand, model, engine_capacity, year, description, req.session.userId]
  );

  res.redirect("/dashboard");
});

router.get("/scooters/edit/:id", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;
  const result = await pool.query(
    "SELECT * FROM scooters WHERE id=$1",
    [req.params.id]
  );

  const scooter = result.rows[0];

  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" &&
      scooter.owner_id !== req.session.userId) {
    return res.send("Brak dostępu");
  }

  res.render("editScooter", { scooter });
});

router.post("/scooters/edit/:id", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;

  await pool.query(
    `UPDATE scooters SET 
    brand=$1, model=$2, engine_capacity=$3,
    year=$4, description=$5
    WHERE id=$6`,
    [
      req.body.brand,
      req.body.model,
      req.body.engine_capacity,
      req.body.year,
      req.body.description,
      req.params.id
    ]
  );

  res.redirect("/dashboard");
});

router.post("/scooters/delete/:id", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;

  const result = await pool.query(
    "SELECT * FROM scooters WHERE id=$1",
    [req.params.id]
  );

  const scooter = result.rows[0];

  if (req.session.role !== "admin" &&
      scooter.owner_id !== req.session.userId) {
    return res.send("Brak dostępu");
  }

  await pool.query("DELETE FROM scooters WHERE id=$1", [req.params.id]);

  res.redirect("/dashboard");
});

module.exports = router;
