// ============================================================
// Util: BitacoraUtil
// Registra acciones en la tabla bitacora
// Fix: eliminado conn.release() — getConnection() no usa pool
// ============================================================

const { getConnection } = require("../config/db");

async function registrarBitacora(usuario, accion, detalle = null) {
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO bitacora (fecha, usuario, accion, detalle_json) VALUES (NOW(), ?, ?, ?)`,
      [usuario, accion, detalle ? JSON.stringify(detalle) : null]
    );
  } catch (err) {
    console.error("[BITACORA ERROR]", err.message);
  }
}

module.exports = { registrarBitacora };
