const asientoRepository = require('../../repositories/prorrateo/asientos.repository');

async function listarAsientos(idPeriodo) {
    
    const asientos = await asientoRepository.getAsientosByPeriodo(idPeriodo);
    console.log("Asientos obtenidos:", asientos);
    
    return asientos; 
}
async function obtenerDetalleAsiento(idAsiento) {
    const detalle = await asientoRepository.getDetalleAsiento(idAsiento);
    console.log("Detalle del asiento obtenido:", detalle); 
    return detalle;
}
module.exports = { listarAsientos, obtenerDetalleAsiento };