// ============================================================
// Repository: DireccionRepository
// Acceso a datos para la tabla "direcciones_tercero"
// ============================================================

const { getConnection } = require("../config/db");

class DireccionRepository {
  // ─── Listar por tercero ───────────────────────────────────
  async findByTercero(id_tercero) {
    const conn = await getConnection();

    const [rows] = await conn.execute(
      `SELECT * FROM direcciones_tercero 
       WHERE id_tercero = ? 
       ORDER BY principal DESC, id_direccion ASC`,
      [id_tercero]
    );

    return rows;
  }

  // ─── Buscar por ID ────────────────────────────────────────
  async findById(id) {
    const conn = await getConnection();

    const [[row]] = await conn.execute(
      `SELECT * FROM direcciones_tercero WHERE id_direccion = ?`,
      [id]
    );

    return row ?? null;
  }

  // ─── ¿Tiene principal activa? ─────────────────────────────
  async hasPrincipalActiva(id_tercero, excludeId = null) {
    const conn = await getConnection();

    let sql = `SELECT id_direccion FROM direcciones_tercero
               WHERE id_tercero = ? AND principal = 1 AND estado = 1`;
    const params = [id_tercero];

    if (excludeId) {
      sql += ` AND id_direccion != ?`;
      params.push(excludeId);
    }

    const [[row]] = await conn.execute(sql, params);

    return !!row;
  }

  // ─── Quitar principal ─────────────────────────────────────
  async clearPrincipal(id_tercero, excludeId = null) {
    const conn = await getConnection();

    let sql = `UPDATE direcciones_tercero SET principal = 0 WHERE id_tercero = ?`;
    const params = [id_tercero];

    if (excludeId) {
      sql += ` AND id_direccion != ?`;
      params.push(excludeId);
    }

    await conn.execute(sql, params);
  }

  // ─── Crear ────────────────────────────────────────────────
  async create({ id_tercero, alias, provincia, canton, distrito, direccion_exacta, estado, principal }) {
    const conn = await getConnection();

    const [result] = await conn.execute(
      `INSERT INTO direcciones_tercero
       (id_tercero, alias, provincia, canton, distrito, direccion_exacta, estado, principal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_tercero,
        alias ?? null,
        provincia ?? null,
        canton ?? null,
        distrito ?? null,
        direccion_exacta,
        estado ?? 1,
        principal ?? 0
      ]
    );

    return result.insertId;
  }

  // ─── Actualizar ───────────────────────────────────────────
  async update(id, { alias, provincia, canton, distrito, direccion_exacta, estado, principal }) {
    const conn = await getConnection();

    await conn.execute(
      `UPDATE direcciones_tercero
       SET alias = ?, provincia = ?, canton = ?, distrito = ?,
           direccion_exacta = ?, estado = ?, principal = ?
       WHERE id_direccion = ?`,
      [
        alias ?? null,
        provincia ?? null,
        canton ?? null,
        distrito ?? null,
        direccion_exacta,
        estado,
        principal ?? 0,
        id
      ]
    );
  }

  // ─── Verificar relaciones ─────────────────────────────────
  async hasRelations(_id) {
    return false;
  }

  // ─── Eliminar ─────────────────────────────────────────────
  async delete(id) {
    const conn = await getConnection();

    await conn.execute(
      `DELETE FROM direcciones_tercero WHERE id_direccion = ?`,
      [id]
    );
  }
}

module.exports = new DireccionRepository();