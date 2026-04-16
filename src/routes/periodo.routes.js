const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/prorrateo/periodo.controller');

// La URL completa para el GET será: http://localhost:3000/api/periodos/listar
router.get('/listar', periodoController.getPeriodos);
console.log("Ruta GET /api/periodos/listar configurada correctamente.");
module.exports = router;