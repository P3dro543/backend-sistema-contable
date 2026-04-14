// ============================================================
// Service: MenuService
// Lógica para el menú dinámico y datos del usuario autenticado
// HU: AUX3 backend / AUX2 backend
// ============================================================

const menuRepo = require("../repositories/menu.repository");

class MenuService {
  // GET /usuarios/me  → datos del usuario logueado
  async getMe(id_usuario) {
    const info = await menuRepo.getUserInfo(id_usuario);
    if (!info) throw { status: 404, message: "Usuario no encontrado." };

    return {
      id_usuario: info.id_usuario,
      username:   info.username,
      nombre_completo: `${info.nombre} ${info.apellido}`,
      correo:     info.correo,
      rol: {
        id:     info.id_rol,
        nombre: info.rol_nombre,
      },
    };
  }

  // GET /usuarios/me/menu  → opciones de menú según rol
  async getMenu(id_usuario, id_rol) {
    const pantallas = await menuRepo.getPantallasByRol(id_rol);
    return pantallas;
  }
}

module.exports = new MenuService();