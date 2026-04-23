// ============================================================
// Controller: TerceroController
// Maneja las peticiones HTTP para /terceros
// HU: AUX5
// ============================================================

const terceroService = require("../services/tercero.service");

const getUsuario = (req) => req.usuario?.username || req.usuario?.nombre || "desconocido";

const listar = async (req, res) => {
  try {
    const data = await terceroService.listar(req.query, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const data = await terceroService.obtenerPorId(req.params.id, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const data = await terceroService.crear(req.body, getUsuario(req));
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const data = await terceroService.actualizar(req.params.id, req.body, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const data = await terceroService.eliminar(req.params.id, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };