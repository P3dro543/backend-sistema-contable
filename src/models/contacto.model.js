// ============================================================
// Model: ContactoTercero
// Representa la entidad "contactos" de la base de datos
// ============================================================

class ContactoTercero {
  constructor({
    id_contacto,
    id_tercero,
    nombre,
    cargo,
    email,
    telefono,
    tipo_contacto,
    estado,
  }) {
    this.id_contacto = id_contacto;
    this.id_tercero = id_tercero;
    this.nombre = nombre;
    this.cargo = cargo ?? null;
    this.email = email ?? null;
    this.telefono = telefono ?? null;
    this.tipo_contacto = tipo_contacto ?? "Principal";
    this.estado = estado ?? "Activo";
  }
}

module.exports = ContactoTercero;