// ============================================================
// Controller: ContactoController
// Maneja peticiones HTTP para /terceros/:id/contactos
// HU: AUX12 backend
// ============================================================

const contactoService = require("../services/contacto.service");

const getUsuario = (req) => req.usuario?.username || req.usuario?.nombre || "desconocido";

const listar = async (req, res) => {
  try {
    const data = await contactoService.listar(req.params.id_tercero, getUsuario(req));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const data = await contactoService.crear(req.params.id_tercero, req.body, getUsuario(req));
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const data = await contactoService.actualizar(
      req.params.id_tercero,
      req.params.id_contacto,
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
    const data = await contactoService.eliminar(
      req.params.id_tercero,
      req.params.id_contacto,
      getUsuario(req)
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { listar, crear, actualizar, eliminar };