// ============================================================
// Routes: /terceros/:id_tercero/contactos
// HU: AUX12 backend
// ============================================================

const express = require("express");
const router  = express.Router({ mergeParams: true });

const ctrl = require("../controllers/contacto.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

// router.use(verificarToken);

// GET    /terceros/:id_tercero/contactos                      → Listar
// POST   /terceros/:id_tercero/contactos                      → Crear
// PUT    /terceros/:id_tercero/contactos/:id_contacto         → Actualizar
// DELETE /terceros/:id_tercero/contactos/:id_contacto         → Eliminar

router.get   ("/",              ctrl.listar);
router.post  ("/",              ctrl.crear);
router.put   ("/:id_contacto",  ctrl.actualizar);
router.delete("/:id_contacto",  ctrl.eliminar);

module.exports = router;