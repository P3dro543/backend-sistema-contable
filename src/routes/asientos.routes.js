const express = require('express');
const router = express.Router();
const asientoController = require('../controllers/prorrateo/asiento.controller');

router.get('/:idPeriodo', asientoController.getAsientos);
router.get('/detalle/:idAsiento', asientoController.getDetalleAsiento);
module.exports = router;