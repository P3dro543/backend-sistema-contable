// ============================================================
// Repository: ReporteTerceroRepository
// Tabla: prorrateo_tercero (campo monto = decimal(18,2))
// HU: AUX9
// Fixes: conn.release() eliminado, total_monto reescrito limpio
// ============================================================

const { getConnection } = require("../config/db");

class ReporteTerceroRepository {
  async getMovimientos({
    id_tercero,
    fecha_inicio,
    fecha_fin,
    id_periodo,
    id_estado,
    pagina     = 1,
    por_pagina = 10,
  }) {
    console.log("REPORTE PARAMS:", { id_tercero, fecha_inicio, fecha_fin, id_periodo, id_estado, pagina, por_pagina });
    const conn   = await getConnection();
    const offset = (pagina - 1) * por_pagina;

    // ─── WHERE dinámico ──────────────────────────────────────
    let where        = `WHERE pt.id_tercero = ?`;
    const baseParams = [id_tercero];

    if (id_periodo) {
      where += ` AND a.id_periodo = ?`;
      baseParams.push(id_periodo);
    } else if (fecha_inicio && fecha_fin) {
      where += ` AND a.fecha BETWEEN ? AND ?`;
      baseParams.push(fecha_inicio, fecha_fin);
    }

    if (id_estado) {
      where += ` AND a.id_estado = ?`;
      baseParams.push(id_estado);
    }

    // ─── FROM reutilizable ───────────────────────────────────
    const from = `
      FROM prorrateo_tercero      pt
      INNER JOIN asiento_detalle  ad ON pt.id_detalle  = ad.id_detalle
      INNER JOIN asientos          a  ON ad.id_asiento  = a.id_asiento
      INNER JOIN estados_asiento  ea  ON a.id_estado    = ea.id_estado
      INNER JOIN cuentas_contables cu ON ad.id_cuenta   = cu.id_cuenta
      INNER JOIN terceros          t  ON pt.id_tercero  = t.id_tercero
      ${where}
    `;

    // ─── Total de filas ──────────────────────────────────────
    const [[{ total }]] = await conn.execute(
      `SELECT COUNT(*) AS total ${from}`,
      baseParams
    );

    // ─── Suma monetaria ──────────────────────────────────────
    const [[{ total_monto }]] = await conn.execute(
      `SELECT COALESCE(SUM(pt.monto), 0) AS total_monto ${from}`,
      baseParams
    );

    // ─── Filas paginadas ─────────────────────────────────────
    const [rows] = await conn.execute(
      `SELECT
         a.id_asiento,
         a.consecutivo,
         a.codigo           AS codigo_asiento,
         a.fecha,
         a.referencia,
         ea.nombre          AS estado_asiento,
         cu.codigo          AS codigo_cuenta,
         cu.nombre          AS cuenta,
         ad.tipo_movimiento,
         ad.descripcion     AS descripcion_linea,
         pt.monto           AS monto_prorrateo,
         t.nombre           AS tercero_nombre
       ${from}
       ORDER BY a.fecha DESC, a.id_asiento DESC
       LIMIT ? OFFSET ?`,
      [...baseParams, por_pagina, offset]
    );
    console.log("RESULTADO:", { total, total_monto, rowsCount: rows.length, rows });
    return { rows, total, total_monto };
    return { rows, total, total_monto };
  }
}

module.exports = new ReporteTerceroRepository();
