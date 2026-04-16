class centross_costos {
    constructor(
        id_centro_costos, 
        codigo, 
        nombre,
        estado
    ) {
        this.id_centro_costos = id_centro_costos;
        this.codigo = codigo;
        this.nombre = nombre;
        this.estado = estado ?? 0;
    }
}

module.exports = centross_costos;