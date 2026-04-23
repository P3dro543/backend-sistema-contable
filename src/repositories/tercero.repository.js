// ============================================================
// Repository: TerceroRepository
// Acceso a datos para la tabla "terceros"
// HU: AUX5
// ============================================================

const { getConnection } = require("../config2/db");

class TerceroRepository {
  // ─── Listar paginado ──────────────────────────────────────
  async findAll({ pagina = 1, por_pagina = 10 }) {
    const conn = await getConnection();
    const offset = (pagina - 1) * por_pagina;

    const [rows] = await conn.execute(
      `SELECT * FROM terceros ORDER BY nombre ASC LIMIT ? OFFSET ?`,
      [por_pagina, offset]
    );

    const [[{ total }]] = await conn.execute(
      `SELECT COUNT(*) AS total FROM terceros`
    );

    conn.release();
    return { rows, total };
  }

  // ─── Buscar por ID ────────────────────────────────────────
  async findById(id) {
    const conn = await getConnection();
    const [[row]] = await conn.execute(
      `SELECT * FROM terceros WHERE id_tercero = ?`,
      [id]
    );
    conn.release();
    return row ?? null;
  }

  // ─── Buscar por identificación (unicidad) ─────────────────
  async findByIdentificacion(identificacion, excludeId = null) {
    const conn = await getConnection();
    let sql = `SELECT id_tercero FROM terceros WHERE identificacion = ?`;
    const params = [identificacion];

    if (excludeId) {
      sql += ` AND id_tercero != ?`;
      params.push(excludeId);
    }

    const [[row]] = await conn.execute(sql, params);
    conn.release();
    return row ?? null;
  }

  // ─── Crear ────────────────────────────────────────────────
  async create({ identificacion, nombre, tipo, correo, telefono, estado }) {
    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO terceros (identificacion, nombre, tipo, correo, telefono, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [identificacion, nombre, tipo, correo ?? null, telefono ?? null, estado ?? 1]
    );
    conn.release();
    return result.insertId;
  }

  // ─── Actualizar ───────────────────────────────────────────
  async update(id, { identificacion, nombre, tipo, correo, telefono, estado }) {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE terceros
       SET identificacion = ?, nombre = ?, tipo = ?, correo = ?, telefono = ?, estado = ?
       WHERE id_tercero = ?`,
      [identificacion, nombre, tipo, correo ?? null, telefono ?? null, estado, id]
    );
    conn.release();
  }

  // ─── Verificar si tiene relaciones (asientos, prorrateos) ─
  async hasRelations(id) {
    const conn = await getConnection();

    const [[a]] = await conn.execute(
      `SELECT COUNT(*) AS c FROM asientos WHERE id_tercero = ?`, [id]
    );
    const [[p]] = await conn.execute(
      `SELECT COUNT(*) AS c FROM prorrateo_tercero WHERE id_tercero = ?`, [id]
    );
    const [[c]] = await conn.execute(
      `SELECT COUNT(*) AS c FROM contactos WHERE id_tercero = ?`, [id]
    );
    const [[d]] = await conn.execute(
      `SELECT COUNT(*) AS c FROM direcciones_tercero WHERE id_tercero = ?`, [id]
    );

    conn.release();
    return (a.c + p.c + c.c + d.c) > 0;
  }

  // ─── Eliminar ─────────────────────────────────────────────
  async delete(id) {
    const conn = await getConnection();
    await conn.execute(`DELETE FROM terceros WHERE id_tercero = ?`, [id]);
    conn.release();
  }
}

module.exports = new TerceroRepository();