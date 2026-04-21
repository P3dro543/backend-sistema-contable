const usuarioController = require('../controllers/usuario.controller');
const express = require('express');
const router = express.Router();
router.post('/login', usuarioController.login);
module.exports = router;