// ============================================================
// Service: ContactoService
// Lógica de negocio para Contactos de Tercero
// HU: AUX12 backend
// ============================================================

const contactoRepo = require("../repositories/contacto.repository");
const terceroRepo  = require("../repositories/tercero.repository");
const { registrarBitacora } = require("../utils/bitacora.util");

class ContactoService {
  // ─── Listar contactos de un tercero ───────────────────────
  async listar(id_tercero, usuario) {
    const tercero = await terceroRepo.findById(id_tercero);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    const rows = await contactoRepo.findByTercero(id_tercero);
    await registrarBitacora(
      usuario,
      "CONSULTA",
      `"El usuario consulta contactos del tercero #${id_tercero}"`
    );
    return rows;
  }

  // ─── Crear contacto ───────────────────────────────────────
  async crear(id_tercero, body, usuario) {
    const tercero = await terceroRepo.findById(id_tercero);
    if (!tercero) throw { status: 404, message: "Tercero no encontrado." };

    const { nombre, cargo, email, telefono, tipo_contacto, estado } = body;

    if (!nombre) throw { status: 400, message: "El nombre del contacto es requerido." };

    const tiposValidos = contactoRepo.getTiposValidos();
    if (tipo_contacto && !tiposValidos.includes(tipo_contacto)) {
      throw {
        status: 400,
        message: `Tipo de contacto inválido. Valores permitidos: ${tiposValidos.join(", ")}.`,
      };
    }

    const id_nuevo = await contactoRepo.create({
      id_tercero, nombre, cargo, email, telefono, tipo_contacto, estado,
    });

    await registrarBitacora(usuario, "CREAR_CONTACTO", {
      tabla: "contactos",
      nombre_contacto: nombre,
      id_tercero: String(id_tercero),
    });

    return { id_contacto: id_nuevo, message: "Contacto creado exitosamente." };
  }

  // ─── Actualizar contacto ──────────────────────────────────
  async actualizar(id_tercero, id_contacto, body, usuario) {
    const anterior = await contactoRepo.findById(id_contacto);
    if (!anterior || anterior.id_tercero != id_tercero) {
      throw { status: 404, message: "Contacto no encontrado para este tercero." };
    }

    const { nombre, cargo, email, telefono, tipo_contacto, estado } = body;

    if (!nombre) throw { status: 400, message: "El nombre del contacto es requerido." };

    const tiposValidos = contactoRepo.getTiposValidos();
    if (tipo_contacto && !tiposValidos.includes(tipo_contacto)) {
      throw {
        status: 400,
        message: `Tipo de contacto inválido. Valores permitidos: ${tiposValidos.join(", ")}.`,
      };
    }

    await contactoRepo.update(id_contacto, {
      nombre, cargo, email, telefono, tipo_contacto, estado,
    });

    await registrarBitacora(usuario, "EDITAR_CONTACTO", {
      tabla: "contactos",
      id_contacto: String(id_contacto),
    });

    return { message: "Contacto actualizado exitosamente." };
  }

  // ─── Eliminar contacto ────────────────────────────────────
  async eliminar(id_tercero, id_contacto, usuario) {
    const contacto = await contactoRepo.findById(id_contacto);
    if (!contacto || contacto.id_tercero != id_tercero) {
      throw { status: 404, message: "Contacto no encontrado para este tercero." };
    }

    const tieneRelaciones = await contactoRepo.hasRelations(id_contacto);
    if (tieneRelaciones) {
      throw { status: 409, message: "No se puede eliminar un registro con datos relacionados." };
    }

    await contactoRepo.delete(id_contacto);
    await registrarBitacora(usuario, "ELIMINAR_CONTACTO", {
      tabla: "contactos",
      id_contacto: String(id_contacto),
    });

    return { message: "Contacto eliminado exitosamente." };
  }
}

module.exports = new ContactoService();