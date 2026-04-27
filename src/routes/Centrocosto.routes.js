const express = require('express');
const router  = express.Router();

const {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  reporte,
} = require('../controllers/Centrocosto.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación JWT
// router.use(verifyToken);

// ─── AUX6: CRUD Centros de Costo ─────────────────────────────────────────────
// GET    /centros-costo              → listado paginado
// GET    /centros-costo/:id          → obtener uno
// POST   /centros-costo              → crear
// PUT    /centros-costo/:id          → actualizar
// DELETE /centros-costo/:id          → eliminar

// IMPORTANTE: /reporte debe ir ANTES de /:id para que Express no lo confunda
// con un id numérico.
// ─── AUX10: Reporte por centro de costo ──────────────────────────────────────
// GET    /centros-costo/reporte      → reporte filtrado
router.get('/reporte', reporte);

router.get('/',      listar);
router.get('/:id',   obtener);
router.post('/',     crear);
router.put('/:id',   actualizar);
router.delete('/:id', eliminar);

module.exports = router;