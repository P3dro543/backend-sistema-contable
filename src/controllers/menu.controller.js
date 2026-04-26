// ============================================================
// Controller: MenuController
// Maneja peticiones HTTP para /usuarios/me y /usuarios/me/menu
// HU: AUX3 backend / AUX2 backend
// ============================================================

const menuService = require("../services/menu.service");

function requireUsuario(req, res) {
  if (!req.usuario || !req.usuario.id_usuario) {
    res.status(401).json({ message: "JWT válido pero sin id_usuario." });
    return false;
  }
  return true;
}

// GET /usuarios/me
// Retorna nombre completo y rol del usuario autenticado
const getMe = async (req, res) => {
  if (!requireUsuario(req, res)) return;
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
  if (!requireUsuario(req, res)) return;
  if (!req.usuario.id_rol) {
    return res.status(401).json({ message: "JWT válido pero sin id_rol." });
  }
  try {
    const data = await menuService.getMenu(req.usuario.id_usuario, req.usuario.id_rol);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getMe, getMenu };

