// ============================================================
// Model: Tercero
// Representa la entidad "terceros" de la base de datos
// ============================================================

class Tercero {
  constructor({
    id_tercero,
    identificacion,
    nombre,
    tipo,
    correo,
    telefono,
    estado,
  }) {
    this.id_tercero = id_tercero;
    this.identificacion = identificacion;
    this.nombre = nombre;
    this.tipo = tipo;
    this.correo = correo ?? null;
    this.telefono = telefono ?? null;
    this.estado = estado ?? 1;
  }
}

module.exports = Tercero;