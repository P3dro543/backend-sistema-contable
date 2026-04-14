// ============================================================
// Routes: /terceros/:id_tercero/direcciones
// HU: AUX11 backend
// ============================================================

const express = require("express");
// mergeParams permite acceder a :id_tercero del router padre
const router  = express.Router({ mergeParams: true });

const ctrl = require("../controllers/direccion.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

router.use(verificarToken);

// GET    /terceros/:id_tercero/direcciones                        → Listar
// POST   /terceros/:id_tercero/direcciones                        → Crear
// PUT    /terceros/:id_tercero/direcciones/:id_direccion          → Actualizar
// DELETE /terceros/:id_tercero/direcciones/:id_direccion          → Eliminar

router.get   ("/",               ctrl.listar);
router.post  ("/",               ctrl.crear);
router.put   ("/:id_direccion",  ctrl.actualizar);
router.delete("/:id_direccion",  ctrl.eliminar);

module.exports = router;