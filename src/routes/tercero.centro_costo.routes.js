const express = require('express');
const router = express.Router();

const centroCostoController = require('../controllers/prorrateo/centro_costo.controller');
const terceroController = require('../controllers/prorrateo/tercero.controller');

// Rutas para centros de costo
router.get('/centros-costo', centroCostoController.getCentrosCosto);

// Rutas para terceros
router.get('/terceros', terceroController.getTerceros);
module.exports = router;