// ============================================================
// Controller: ReporteTerceroController
// Maneja peticiones HTTP para /reportes/terceros
// HU: AUX9
// ============================================================

const reporteService = require("../services/reporte.tercero.service");

const getUsuario = (req) => req.usuario?.username || req.usuario?.nombre || "desconocido";

const getReporte = async (req, res) => {
  try {
    const data = await reporteService.getReporte(req.query, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getReporte };