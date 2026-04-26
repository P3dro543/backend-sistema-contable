// ============================================================
// Routes: /usuarios/me  y  /usuarios/me/menu
// HU: AUX2 backend (getMe) + AUX3 backend (getMenu)
// ============================================================

const express = require("express");
const router = express.Router();

const jwtMiddleware = require("../middlewares/jwt.middleware");
const ctrl = require("../controllers/menu.controller");

router.use(jwtMiddleware);

// GET /usuarios/me        → Nombre completo + rol del usuario logueado
// GET /usuarios/me/menu   → Pantallas/opciones de menú según rol
router.get("/me", ctrl.getMe);
router.get("/me/menu", ctrl.getMenu);

module.exports = router;

