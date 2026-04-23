// ============================================================
// Service: ReporteTerceroService
// Lógica de negocio para el reporte de movimientos por tercero
// HU: AUX9
// ============================================================

const reporteRepo = require("../repositories/reporte.tercero.repository");
const terceroRepo = require("../repositories/tercero.repository");
const { registrarBitacora } = require("../utils/bitacora.util");

class ReporteTerceroService {
  async getReporte(query, usuario) {
    const { id_tercero, fecha_inicio, fecha_fin, id_periodo, id_estado } = query;
    const pagina    = parseInt(query.pagina)    || 1;
    const por_pagina = parseInt(query.por_pagina) || 10;

    // Tercero requerido
    if (!id_tercero) {
      throw { status: 400, message: "El parámetro id_tercero es requerido." };
    }

    const tercero = await terceroRepo.findById(id_tercero);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    // Debe indicar periodo O rango de fechas
    if (!id_periodo && (!fecha_inicio || !fecha_fin)) {
      throw {
        status: 400,
        message: "Debe indicar id_periodo o un rango de fechas (fecha_inicio y fecha_fin).",
      };
    }

    const resultado = await reporteRepo.getMovimientos({
      id_tercero: parseInt(id_tercero),
      fecha_inicio,
      fecha_fin,
      id_periodo: id_periodo ? parseInt(id_periodo) : null,
      id_estado: id_estado ? parseInt(id_estado) : null,
      pagina,
      por_pagina,
    });

    await registrarBitacora(usuario, "REPORTE_TERCERO", {
      id_tercero, fecha_inicio, fecha_fin, id_periodo, id_estado,
    });

    return {
      tercero: { id: tercero.id_tercero, nombre: tercero.nombre },
      ...resultado,
      pagina,
      por_pagina,
    };
  }
}

module.exports = new ReporteTerceroService();