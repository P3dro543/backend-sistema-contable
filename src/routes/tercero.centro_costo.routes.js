const express = require('express');
const router = express.Router();

const centroCostoController = require('../controllers/prorrateo/centro_costo.controller');
const terceroController = require('../controllers/prorrateo/tercero.controller');

// Rutas para centros de costo
router.get('/centros-costo', centroCostoController.getCentrosCosto);
router.get('/centros-costo/:id_detalle', centroCostoController.getProrrateo);
// Rutas para terceros
router.get('/terceros', terceroController.getTerceros);
router.get('/terceros/:id_detalle', terceroController.getProrrateo);
router.post('/', terceroController.guardarProrrateo);
module.exports = router;