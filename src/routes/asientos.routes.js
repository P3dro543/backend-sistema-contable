const express = require("express");
const router = express.Router();
const asientoController = require("../controllers/prorrateo/asiento.controller");

router.get("/detalle/:idAsiento", asientoController.getDetalleAsiento);
router.get("/:idPeriodo", asientoController.getAsientos);

module.exports = router;

