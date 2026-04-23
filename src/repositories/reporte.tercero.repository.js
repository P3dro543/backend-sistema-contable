// ============================================================
// Repository: ReporteTerceroRepository
// Consultas para el reporte de movimientos por tercero
// HU: AUX9
// ============================================================

const { getConnection } = require("../config2/db");

class ReporteTerceroRepository {
  /**
   * Obtiene movimientos de asientos asociados a un tercero
   * a través de prorrateo_tercero.
   *
   * Filtros:
   *   - id_tercero (requerido)
   *   - fecha_inicio / fecha_fin  O  id_periodo
   *   - id_estado (opcional)
   *   - pagina / por_pagina
   */
  async getMovimientos({
    id_tercero,
    fecha_inicio,
    fecha_fin,
    id_periodo,
    id_estado,
    pagina = 1,
    por_pagina = 10,
  }) {
    const conn = await getConnection();
    const offset = (pagina - 1) * por_pagina;
    const params = [];

    let sql = `
      SELECT
        a.id_asiento,
        a.codigo,
        a.fecha,
        a.referencia,
        ea.nombre        AS estado_asiento,
        cc.codigo        AS codigo_cuenta,
        cc.nombre        AS nombre_cuenta,
        ad.tipo_movimiento,
        ad.descripcion   AS descripcion_linea,
        pt.monto         AS monto_asignado,
        t.nombre         AS tercero_nombre
      FROM prorrateo_tercero pt
      INNER JOIN asiento_detalle  ad ON pt.id_detalle   = ad.id_detalle
      INNER JOIN asientos          a  ON ad.id_asiento   = a.id_asiento
      INNER JOIN estados_asiento  ea  ON a.id_estado     = ea.id_estado
      INNER JOIN cuentas_contables cc ON ad.id_cuenta    = cc.id_cuenta
      INNER JOIN terceros          t  ON pt.id_tercero   = t.id_tercero
      WHERE pt.id_tercero = ?
    `;
    params.push(id_tercero);

    // Filtro por periodo contable
    if (id_periodo) {
      sql += ` AND a.id_periodo = ?`;
      params.push(id_periodo);
    } else if (fecha_inicio && fecha_fin) {
      sql += ` AND a.fecha BETWEEN ? AND ?`;
      params.push(fecha_inicio, fecha_fin);
    }

    // Filtro por estado del asiento (opcional)
    if (id_estado) {
      sql += ` AND a.id_estado = ?`;
      params.push(id_estado);
    }

    // Total sin paginado
    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) sub`;
    const [[{ total }]] = await conn.execute(countSql, params);

    // Paginado
    sql += ` ORDER BY a.fecha DESC, a.id_asiento DESC LIMIT ? OFFSET ?`;
    params.push(por_pagina, offset);

    const [rows] = await conn.execute(sql, params);

    // Total monetario del filtro completo (sin paginar)
    const totalSql = `SELECT COALESCE(SUM(pt2.monto), 0) AS total_monto
      FROM prorrateo_tercero pt2
      INNER JOIN asiento_detalle ad2 ON pt2.id_detalle = ad2.id_detalle
      INNER JOIN asientos a2        ON ad2.id_asiento  = a2.id_asiento
      WHERE pt2.id_tercero = ?`;
    const totalParams = [id_tercero];

    if (id_periodo) {
      totalSql; // ya construido arriba; replicamos para el SUM
    }

    const [[{ total_monto }]] = await conn.execute(
      `SELECT COALESCE(SUM(sub.monto_asignado), 0) AS total_monto
       FROM (${countSql.replace("COUNT(*) AS total", "pt.monto AS monto_asignado")}) sub`,
      params.slice(0, params.length - 2) // sin LIMIT/OFFSET
    );

    conn.release();
    return { rows, total, total_monto };
  }
}

module.exports = new ReporteTerceroRepository();