// ============================================================
// Service: TerceroService
// Lógica de negocio para el CRUD de Terceros
// HU: AUX5
// ============================================================

const terceroRepo = require("../repositories/tercero.repository");
const { registrarBitacora } = require("../utils/bitacora.util");

const TIPOS_VALIDOS = ["Cliente", "Proveedor", "Empleado", "Otro"];

class TerceroService {
  // ─── Listar paginado ──────────────────────────────────────
  async listar(query, usuario) {
    const pagina = parseInt(query.pagina) || 1;
    const por_pagina = parseInt(query.por_pagina) || 10;

    const resultado = await terceroRepo.findAll({ pagina, por_pagina });
    await registrarBitacora(usuario, "El usuario consulta terceros", null);
    return resultado;
  }

  // ─── Obtener por ID ───────────────────────────────────────
  async obtenerPorId(id, usuario) {
    const tercero = await terceroRepo.findById(id);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };
    await registrarBitacora(usuario, `El usuario consulta tercero #${id}`, null);
    return tercero;
  }

  // ─── Crear ────────────────────────────────────────────────
  async crear(body, usuario) {
    const { identificacion, nombre, tipo, correo, telefono, estado } = body;

    // Validaciones
    if (!identificacion || !nombre || !tipo) {
      throw { status: 400, message: "Identificación, nombre y tipo son requeridos." };
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw { status: 400, message: `Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}.` };
    }
    const existe = await terceroRepo.findByIdentificacion(identificacion);
    if (existe) {
      throw { status: 409, message: "Ya existe un tercero con esa identificación." };
    }

    const id_nuevo = await terceroRepo.create({ identificacion, nombre, tipo, correo, telefono, estado });

    await registrarBitacora(usuario, "Creación de Tercero", {
      identificacion, nombre, tipo, correo, telefono,
      estado: estado ?? 1, error: "", id_tercero: String(id_nuevo),
    });

    return { id_tercero: id_nuevo, message: "Tercero creado exitosamente." };
  }

  // ─── Actualizar ───────────────────────────────────────────
  async actualizar(id, body, usuario) {
    const anterior = await terceroRepo.findById(id);
    if (!anterior) throw { status: 404, message: "Tercero no encontrado." };

    const { identificacion, nombre, tipo, correo, telefono, estado } = body;

    if (!identificacion || !nombre || !tipo) {
      throw { status: 400, message: "Identificación, nombre y tipo son requeridos." };
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw { status: 400, message: `Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}.` };
    }
    const existe = await terceroRepo.findByIdentificacion(identificacion, id);
    if (existe) {
      throw { status: 409, message: "Ya existe otro tercero con esa identificación." };
    }

    await terceroRepo.update(id, { identificacion, nombre, tipo, correo, telefono, estado });

    await registrarBitacora(usuario, "Actualización de Tercero", {
      Anterior: anterior,
      Nuevo: { id_tercero: String(id), identificacion, nombre, tipo, correo, telefono, estado, error: "" },
    });

    return { message: "Tercero actualizado exitosamente." };
  }

  // ─── Eliminar ─────────────────────────────────────────────
  async eliminar(id, usuario) {
    const tercero = await terceroRepo.findById(id);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    const tieneRelaciones = await terceroRepo.hasRelations(id);
    if (tieneRelaciones) {
      throw { status: 409, message: "No se puede eliminar un registro con datos relacionados." };
    }

    await terceroRepo.delete(id);
    await registrarBitacora(usuario, "Eliminación de Tercero", tercero);

    return { message: "Tercero eliminado exitosamente." };
  }
}

module.exports = new TerceroService();