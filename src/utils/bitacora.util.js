// ============================================================
// Util: BitacoraUtil
// Registra acciones en la tabla bitacora
// Usado en todas las HUs (AUX5, AUX9, AUX11, AUX12)
// ============================================================

const { getConnection } = require("../config/db");

/**
 * @param {string} usuario   - Nombre de usuario activo
 * @param {string} accion    - Descripción de la acción
 * @param {object|null} detalle - JSON con detalle (puede ser null)
 */
async function registrarBitacora(usuario, accion, detalle = null) {
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO bitacora (fecha, usuario, accion, detalle_json) VALUES (NOW(), ?, ?, ?)`,
      [usuario, accion, detalle ? JSON.stringify(detalle) : null]
    );
  } catch (err) {
    // La bitácora nunca debe romper el flujo principal
    console.error("[BITACORA ERROR]", err.message);
  }
}

module.exports = { registrarBitacora };