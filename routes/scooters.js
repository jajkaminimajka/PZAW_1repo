const express            = require("express");
const router             = express.Router();
const { requireLogin }   = require("../middleware/auth");

function validateScooter(body) {
  const errors = [];
  const { brand, model, engine_capacity, year } = body;

  if (!brand || brand.trim().length < 2)
    errors.push("Marka musi mieć co najmniej 2 znaki.");
  if (brand && brand.trim().length > 100)
    errors.push("Marka może mieć maksymalnie 100 znaków.");

  if (!model || model.trim().length < 1)
    errors.push("Model jest wymagany.");
  if (model && model.trim().length > 100)
    errors.push("Model może mieć maksymalnie 100 znaków.");

  if (engine_capacity !== "" && engine_capacity !== undefined) {
    const ec = Number(engine_capacity);
    if (isNaN(ec) || ec < 1 || ec > 2000)
      errors.push("Pojemność silnika musi być liczbą z zakresu 1–2000 cc.");
  }

  if (year !== "" && year !== undefined) {
    const y = Number(year);
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear() + 1)
      errors.push(`Rok produkcji musi być z zakresu 1900–${new Date().getFullYear() + 1}.`);
  }

  return errors;
}

router.get("/dashboard", requireLogin, async (req, res) => {
  const pool = req.app.locals.pool;
  let result;

  if (req.session.role === "admin") {
    result = await pool.query(
      `SELECT s.*, u.username AS owner_name
       FROM scooters s JOIN users u ON s.owner_id = u.id
       ORDER BY s.id DESC`
    );
  } else {
    result = await pool.query(
      `SELECT s.*, u.username AS owner_name
       FROM scooters s JOIN users u ON s.owner_id = u.id
       WHERE s.owner_id = $1
       ORDER BY s.id DESC`,
      [req.session.userId]
    );
  }

  res.render("dashboard", { scooters: result.rows });
});

router.get("/scooters/add", requireLogin, (req, res) => {
  res.render("addScooter", { errors: [], old: {} });
});

router.post("/scooters/add", requireLogin, async (req, res) => {
  const pool   = req.app.locals.pool;
  const errors = validateScooter(req.body);
  const old    = req.body;

  if (errors.length) return res.render("addScooter", { errors, old });

  const { brand, model, engine_capacity, year, description } = req.body;

  await pool.query(
    `INSERT INTO scooters (brand, model, engine_capacity, year, description, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      brand.trim(),
      model.trim(),
      engine_capacity || null,
      year || null,
      description ? description.trim() : null,
      req.session.userId,
    ]
  );

  req.flash("success", "Skuter został dodany.");
  res.redirect("/dashboard");
});

router.get("/scooters/edit/:id", requireLogin, async (req, res) => {
  const pool   = req.app.locals.pool;
  const result = await pool.query(
    "SELECT * FROM scooters WHERE id = $1", [req.params.id]
  );
  const scooter = result.rows[0];

  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" && scooter.owner_id !== req.session.userId)
    return res.status(403).render("error", { message: "Brak dostępu do tego skutera." });

  res.render("editScooter", { scooter, errors: [], old: scooter });
});

router.post("/scooters/edit/:id", requireLogin, async (req, res) => {
  const pool   = req.app.locals.pool;
  const result = await pool.query(
    "SELECT * FROM scooters WHERE id = $1", [req.params.id]
  );
  const scooter = result.rows[0];

  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" && scooter.owner_id !== req.session.userId)
    return res.status(403).render("error", { message: "Brak dostępu do tego skutera." });

  const errors = validateScooter(req.body);
  const old    = req.body;

  if (errors.length) return res.render("editScooter", { scooter, errors, old });

  const { brand, model, engine_capacity, year, description } = req.body;

  await pool.query(
    `UPDATE scooters SET
       brand=$1, model=$2, engine_capacity=$3, year=$4, description=$5
     WHERE id=$6`,
    [
      brand.trim(),
      model.trim(),
      engine_capacity || null,
      year || null,
      description ? description.trim() : null,
      req.params.id,
    ]
  );

  req.flash("success", "Zmiany zostały zapisane.");
  res.redirect("/dashboard");
});

router.post("/scooters/delete/:id", requireLogin, async (req, res) => {
  const pool   = req.app.locals.pool;
  const result = await pool.query(
    "SELECT * FROM scooters WHERE id = $1", [req.params.id]
  );
  const scooter = result.rows[0];

  if (!scooter) return res.redirect("/dashboard");

  if (req.session.role !== "admin" && scooter.owner_id !== req.session.userId)
    return res.status(403).render("error", { message: "Brak dostępu do tego skutera." });

  await pool.query("DELETE FROM scooters WHERE id = $1", [req.params.id]);
  req.flash("success", "Skuter został usunięty.");
  res.redirect("/dashboard");
});

module.exports = router;
