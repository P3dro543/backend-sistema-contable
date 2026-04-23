// ============================================================
// Repository: MenuRepository
// Retorna pantallas disponibles según el rol del usuario
// HU: AUX3 backend
// ============================================================

const { getConnection } = require("../config2/db");

class MenuRepository {
  /**
   * Devuelve las pantallas activas del rol del usuario
   * usando el stored procedure sp_obtener_pantallas_por_rol
   */
  async getPantallasByRol(id_rol) {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `CALL sp_obtener_pantallas_por_rol(?)`,
      [id_rol]
    );
    conn.release();
    // El SP devuelve el resultado en rows[0]
    return rows[0];
  }

  /**
   * Devuelve el nombre completo del usuario (para AUX2 backend)
   */
  async getUserInfo(id_usuario) {
    const conn = await getConnection();
    const [[row]] = await conn.execute(
      `SELECT u.id_usuario, u.username, u.nombre, u.apellido, u.correo,
              r.id_rol, r.nombre AS rol_nombre
       FROM usuarios u
       INNER JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
       INNER JOIN roles r        ON ur.id_rol     = r.id_rol
       WHERE u.id_usuario = ?
       LIMIT 1`,
      [id_usuario]
    );
    conn.release();
    return row ?? null;
  }
}

module.exports = new MenuRepository();