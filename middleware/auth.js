function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.role !== "admin") return res.status(403).render("error", {
    message: "Brak uprawnień administratora."
  });
  next();
}

module.exports = { requireLogin, requireAdmin };
