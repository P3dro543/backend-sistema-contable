// ============================================================
// app.js  — Configuración principal de Express
// Integra las rutas de las HUs: AUX3, AUX5, AUX9, AUX11, AUX12
// ============================================================

const express = require("express");
const cors    = require("cors");

const app = express();

// ─── Middlewares globales ─────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Importar rutas ──────────────────────────────────────────

// AUX2 backend + AUX3 backend: info del usuario y menú dinámico
const menuRoutes            = require("./routes/menu.routes");

// AUX5: CRUD de Terceros
const terceroRoutes         = require("./routes/tercero.routes");

// AUX11 backend: Direcciones de tercero
const direccionRoutes       = require("./routes/direccion.routes");

// AUX12 backend: Contactos de tercero
const contactoRoutes        = require("./routes/contacto.routes");

// AUX9: Reporte de movimientos por tercero
const reporteTerceroRoutes  = require("./routes/reporte.tercero.routes");

// Rutas de Felipe (AUX1, AUX7, AUX8, etc.)
const usuarioRoutes         = require("./routes/usuario.routes");
const asientosRoutes        = require("./routes/asientos.routes");
const periodoRoutes         = require("./routes/periodo.routes");
const prorrateoRoutes       = require("./routes/tercero.centro_costo.routes");


// ─── Montar rutas ────────────────────────────────────────────

// /usuarios/me  y  /usuarios/me/menu
app.use("/usuarios", menuRoutes);

// /terceros  (CRUD principal)
app.use("/terceros", terceroRoutes);

// /terceros/:id_tercero/direcciones  (sub-recurso anidado)
app.use("/terceros/:id_tercero/direcciones", direccionRoutes);

// /terceros/:id_tercero/contactos  (sub-recurso anidado)
app.use("/terceros/:id_tercero/contactos", contactoRoutes);

// /reportes/terceros
app.use("/reportes/terceros", reporteTerceroRoutes);

// Montaje de rutas de Felipe
app.use("/auth", usuarioRoutes);
app.use("/api/asientos", asientosRoutes);
app.use("/api/periodos", periodoRoutes);
app.use("/api/prorrateo", prorrateoRoutes);


// ─── Manejador global de errores ─────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor.",
  });
});

// ─── Ruta raíz (healthcheck) ─────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend Contable API corriendo." });
});

module.exports = app;