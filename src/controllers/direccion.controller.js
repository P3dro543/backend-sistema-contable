// ============================================================
// Controller: DireccionController
// Maneja peticiones HTTP para /terceros/:id/direcciones
// HU: AUX11 backend
// ============================================================

const direccionService = require("../services/direccion.service");

const getUsuario = (req) => req.usuario?.username || req.usuario?.nombre || "desconocido";

const listar = async (req, res) => {
  try {
    const data = await direccionService.listar(req.params.id_tercero, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const data = await direccionService.crear(req.params.id_tercero, req.body, getUsuario(req));
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const data = await direccionService.actualizar(
      req.params.id_tercero,
      req.params.id_direccion,
      req.body,
      getUsuario(req)
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const data = await direccionService.eliminar(
      req.params.id_tercero,
      req.params.id_direccion,
      getUsuario(req)
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { listar, crear, actualizar, eliminar };