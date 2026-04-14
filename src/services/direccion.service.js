// ============================================================
// Service: DireccionService
// Lógica de negocio para Direcciones de Tercero
// HU: AUX11 backend
// ============================================================

const direccionRepo = require("../repositories/direccion.repository");
const terceroRepo   = require("../repositories/tercero.repository");
const { registrarBitacora } = require("../utils/bitacora.util");

class DireccionService {
  // ─── Listar direcciones de un tercero ─────────────────────
  async listar(id_tercero, usuario) {
    const tercero = await terceroRepo.findById(id_tercero);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    const rows = await direccionRepo.findByTercero(id_tercero);
    await registrarBitacora(
      usuario,
      "CONSULTA",
      `"El usuario consulta direcciones del tercero #${id_tercero}"`
    );
    return rows;
  }

  // ─── Crear dirección ──────────────────────────────────────
  async crear(id_tercero, body, usuario) {
    const tercero = await terceroRepo.findById(id_tercero);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    const { alias, provincia, canton, distrito, direccion_exacta, estado, principal } = body;

    if (!direccion_exacta) {
      throw { status: 400, message: "La dirección exacta es requerida." };
    }

    // Si se marca como principal, limpiar las demás
    if (principal == 1 || principal === true) {
      await direccionRepo.clearPrincipal(id_tercero);
    }

    const id_nuevo = await direccionRepo.create({
      id_tercero, alias, provincia, canton, distrito,
      direccion_exacta, estado, principal,
    });

    await registrarBitacora(usuario, "CREAR_DIRECCION", {
      id_tercero, alias, provincia, canton, distrito,
      direccion_exacta, estado: estado ?? 1, principal: principal ?? 0,
      id_nuevo,
    });

    return { id_direccion: id_nuevo, message: "Dirección creada exitosamente." };
  }

  // ─── Actualizar dirección ─────────────────────────────────
  async actualizar(id_tercero, id_direccion, body, usuario) {
    const anterior = await direccionRepo.findById(id_direccion);
    if (!anterior || anterior.id_tercero != id_tercero) {
      throw { status: 404, message: "Dirección no encontrada para este tercero." };
    }

    const { alias, provincia, canton, distrito, direccion_exacta, estado, principal } = body;

    if (!direccion_exacta) {
      throw { status: 400, message: "La dirección exacta es requerida." };
    }

    // Si se marca como principal, limpiar las demás (excepto esta)
    if (principal == 1 || principal === true) {
      await direccionRepo.clearPrincipal(id_tercero, id_direccion);
    }

    await direccionRepo.update(id_direccion, {
      alias, provincia, canton, distrito, direccion_exacta, estado, principal,
    });

    await registrarBitacora(usuario, "ACTUALIZAR_DIRECCION", {
      anterior,
      nuevo: { alias, provincia, canton, distrito, direccion_exacta, estado, principal: principal ?? 0, id_direccion },
    });

    return { message: "Dirección actualizada exitosamente." };
  }

  // ─── Eliminar dirección ───────────────────────────────────
  async eliminar(id_tercero, id_direccion, usuario) {
    const direccion = await direccionRepo.findById(id_direccion);
    if (!direccion || direccion.id_tercero != id_tercero) {
      throw { status: 404, message: "Dirección no encontrada para este tercero." };
    }

    const tieneRelaciones = await direccionRepo.hasRelations(id_direccion);
    if (tieneRelaciones) {
      throw { status: 409, message: "No se puede eliminar un registro con datos relacionados." };
    }

    await direccionRepo.delete(id_direccion);
    await registrarBitacora(usuario, "ELIMINAR_DIRECCION", direccion);

    return { message: "Dirección eliminada exitosamente." };
  }
}

module.exports = new DireccionService();