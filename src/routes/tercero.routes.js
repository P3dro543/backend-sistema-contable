// ============================================================
// Routes: /terceros
// HU: AUX5
// ============================================================

const express = require("express");
const router  = express.Router();

const ctrl = require("../controllers/tercero.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verificarToken);

// GET    /terceros              → Listar paginado
// POST   /terceros              → Crear nuevo tercero
// GET    /terceros/:id          → Obtener por ID
// PUT    /terceros/:id          → Actualizar
// DELETE /terceros/:id          → Eliminar

router.get   ("/",    ctrl.listar);
router.post  ("/",    ctrl.crear);
router.get   ("/:id", ctrl.obtenerPorId);
router.put   ("/:id", ctrl.actualizar);
router.delete("/:id", ctrl.eliminar);

module.exports = router;