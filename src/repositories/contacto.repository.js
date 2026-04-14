// ============================================================
// Repository: ContactoRepository
// Acceso a datos para la tabla "contactos"
// HU: AUX12 backend
// ============================================================

const { getConnection } = require("../config/db");

const TIPOS_VALIDOS = ["Principal", "Facturacion", "Cobros", "Soporte", "Otro"];

class ContactoRepository {
  getTiposValidos() {
    return TIPOS_VALIDOS;
  }

  // ─── Listar por tercero ───────────────────────────────────
  async findByTercero(id_tercero) {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM contactos WHERE id_tercero = ? ORDER BY tipo_contacto ASC, id_contacto ASC`,
      [id_tercero]
    );
    conn.release();
    return rows;
  }

  // ─── Buscar por ID ────────────────────────────────────────
  async findById(id) {
    const conn = await getConnection();
    const [[row]] = await conn.execute(
      `SELECT * FROM contactos WHERE id_contacto = ?`,
      [id]
    );
    conn.release();
    return row ?? null;
  }

  // ─── Crear ────────────────────────────────────────────────
  async create({ id_tercero, nombre, cargo, email, telefono, tipo_contacto, estado }) {
    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO contactos (id_tercero, nombre, cargo, email, telefono, tipo_contacto, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_tercero,
        nombre,
        cargo ?? null,
        email ?? null,
        telefono ?? null,
        tipo_contacto ?? "Principal",
        estado ?? "Activo",
      ]
    );
    conn.release();
    return result.insertId;
  }

  // ─── Actualizar ───────────────────────────────────────────
  async update(id, { nombre, cargo, email, telefono, tipo_contacto, estado }) {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE contactos
       SET nombre = ?, cargo = ?, email = ?, telefono = ?, tipo_contacto = ?, estado = ?
       WHERE id_contacto = ?`,
      [
        nombre,
        cargo ?? null,
        email ?? null,
        telefono ?? null,
        tipo_contacto ?? "Principal",
        estado ?? "Activo",
        id,
      ]
    );
    conn.release();
  }

  // ─── Verificar relaciones ─────────────────────────────────
  async hasRelations(_id) {
    // Los contactos no tienen tablas dependientes en el esquema actual
    return false;
  }

  // ─── Eliminar ─────────────────────────────────────────────
  async delete(id) {
    const conn = await getConnection();
    await conn.execute(`DELETE FROM contactos WHERE id_contacto = ?`, [id]);
    conn.release();
  }
}

module.exports = new ContactoRepository();