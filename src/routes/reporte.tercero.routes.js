// ============================================================
// Routes: /reportes/terceros
// HU: AUX9
// ============================================================

const express = require("express");
const router  = express.Router();

const ctrl = require("../controllers/reporte.tercero.controller");

// GET /reportes/terceros?id_tercero=X&fecha_inicio=Y&fecha_fin=Z&pagina=1
// GET /reportes/terceros?id_tercero=X&id_periodo=1&id_estado=2&pagina=1

router.get("/", ctrl.getReporte);

module.exports = router;