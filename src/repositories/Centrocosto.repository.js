const { getConnection } = require('../config/db');

// ─── LISTADO PAGINADO ────────────────────────────────────────
const getAll = async (pagina = 1, porPagina = 10) => {
  const conn = await getConnection();
  const offset = (pagina - 1) * porPagina;

  const [rows] = await conn.execute(
    `SELECT * FROM centros_costo
     ORDER BY id_centro_costo ASC
     LIMIT ? OFFSET ?`,
    [porPagina, offset]
  );

  const [[{ total }]] = await conn.execute(
    `SELECT COUNT(*) AS total FROM centros_costo`
  );

  return { data: rows, total };
};

// ─── BUSCAR POR ID ───────────────────────────────────────────
const getById = async (id) => {
  const conn = await getConnection();

  const [rows] = await conn.execute(
    `SELECT * FROM centros_costo WHERE id_centro_costo = ?`,
    [id]
  );

  return rows[0] || null;
};

// ─── VERIFICAR CÓDIGO ÚNICO ──────────────────────────────────
const existeCodigo = async (codigo, excludeId = null) => {
  const conn = await getConnection();

  let sql = `SELECT id_centro_costo FROM centros_costo WHERE codigo = ?`;
  const params = [codigo];

  if (excludeId) {
    sql += ` AND id_centro_costo != ?`;
    params.push(excludeId);
  }

  const [rows] = await conn.execute(sql, params);
  return rows.length > 0;
};

// ─── CREAR ───────────────────────────────────────────────────
const create = async ({ codigo, nombre, descripcion, estado }) => {
  const conn = await getConnection();

  const [result] = await conn.execute(
    `INSERT INTO centros_costo (codigo, nombre, descripcion, estado)
     VALUES (?, ?, ?, ?)`,
    [codigo, nombre, descripcion || null, estado]
  );

  return result.insertId;
};

// ─── ACTUALIZAR ──────────────────────────────────────────────
const update = async (id, { codigo, nombre, descripcion, estado }) => {
  const conn = await getConnection();

  const [result] = await conn.execute(
    `UPDATE centros_costo
     SET codigo = ?, nombre = ?, descripcion = ?, estado = ?
     WHERE id_centro_costo = ?`,
    [codigo, nombre, descripcion || null, estado, id]
  );

  return result.affectedRows;
};

// ─── VERIFICAR RELACIONES ────────────────────────────────────
const tieneRelaciones = async (id) => {
  const conn = await getConnection();

  const [rows] = await conn.execute(
    `SELECT id_prorrateo_cc FROM prorrateo_centro_costo
     WHERE id_centro_costo = ? LIMIT 1`,
    [id]
  );

  return rows.length > 0;
};

// ─── ELIMINAR ────────────────────────────────────────────────
const remove = async (id) => {
  const conn = await getConnection();

  const [result] = await conn.execute(
    `DELETE FROM centros_costo WHERE id_centro_costo = ?`,
    [id]
  );

  return result.affectedRows;
};

// ─── REPORTE ─────────────────────────────────────────────────
const getReporte = async ({
  id_centro_costo,
  fecha_inicio,
  fecha_fin,
  id_periodo,
  id_estado,
  pagina = 1,
  porPagina = 10,
}) => {
  const conn = await getConnection();
  const offset = (pagina - 1) * porPagina;
  const params = [];

  let whereClause = `WHERE pcc.id_centro_costo = ?`;
  params.push(id_centro_costo);

  if (id_periodo) {
    whereClause += ` AND a.id_periodo = ?`;
    params.push(id_periodo);
  } else if (fecha_inicio && fecha_fin) {
    whereClause += ` AND a.fecha BETWEEN ? AND ?`;
    params.push(fecha_inicio, fecha_fin);
  }

  if (id_estado) {
    whereClause += ` AND a.id_estado = ?`;
    params.push(id_estado);
  }

  const baseQuery = `
    FROM prorrateo_centro_costo pcc
    INNER JOIN asiento_detalle  ad  ON pcc.id_detalle        = ad.id_detalle
    INNER JOIN asientos         a   ON ad.id_asiento         = a.id_asiento
    INNER JOIN estados_asiento  ea  ON a.id_estado           = ea.id_estado
    INNER JOIN centros_costo    cc  ON pcc.id_centro_costo   = cc.id_centro_costo
    INNER JOIN cuentas_contables cu ON ad.id_cuenta          = cu.id_cuenta
    ${whereClause}
  `;

  const [rows] = await conn.execute(
    `SELECT
       a.id_asiento,
       a.consecutivo,
       a.codigo AS codigo_asiento,
       a.fecha,
       a.referencia,
       ea.nombre AS estado_asiento,
       cu.nombre AS cuenta,
       ad.tipo_movimiento,
       ad.descripcion AS descripcion_linea,
       pcc.monto AS monto_prorrateo,
       cc.nombre AS centro_costo,
       cc.codigo AS codigo_cc
     ${baseQuery}
     ORDER BY a.fecha DESC, a.id_asiento DESC
     LIMIT ? OFFSET ?`,
    [...params, porPagina, offset]
  );

  const [[{ total }]] = await conn.execute(
    `SELECT COUNT(*) AS total ${baseQuery}`,
    params
  );

  const [[{ suma }]] = await conn.execute(
    `SELECT COALESCE(SUM(pcc.monto), 0) AS suma ${baseQuery}`,
    params
  );

  return { data: rows, total: Number(total), suma: Number(suma) };
};

module.exports = {
  getAll,
  getById,
  existeCodigo,
  create,
  update,
  tieneRelaciones,
  remove,
  getReporte,
};