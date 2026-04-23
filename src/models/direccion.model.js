// ============================================================
// Model: DireccionTercero
// Representa la entidad "direcciones_tercero" de la BD
// ============================================================

class DireccionTercero {
  constructor({
    id_direccion,
    id_tercero,
    alias,
    provincia,
    canton,
    distrito,
    direccion_exacta,
    estado,
    principal,
  }) {
    this.id_direccion = id_direccion;
    this.id_tercero = id_tercero;
    this.alias = alias ?? null;
    this.provincia = provincia ?? null;
    this.canton = canton ?? null;
    this.distrito = distrito ?? null;
    this.direccion_exacta = direccion_exacta;
    this.estado = estado ?? 1;
    this.principal = principal ?? 0;
  }
}

module.exports = DireccionTercero;