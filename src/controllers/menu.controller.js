// ============================================================
// Controller: MenuController
// Maneja peticiones HTTP para /usuarios/me y /usuarios/me/menu
// HU: AUX3 backend / AUX2 backend
// ============================================================

const menuService = require("../services/menu.service");

const getUsuario = (req) => req.usuario?.username || req.usuario?.nombre || "desconocido";

// GET /usuarios/me
// Retorna nombre completo y rol del usuario autenticado
const getMe = async (req, res) => {
  try {
    const data = await menuService.getMe(req.usuario.id_usuario);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /usuarios/me/menu
// Retorna las opciones de menú disponibles según el rol
const getMenu = async (req, res) => {
  try {
    const data = await menuService.getMenu(
      req.usuario.id_usuario,
      req.usuario.id_rol
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getMe, getMenu };