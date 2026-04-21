const centro_costoRepository = require('../../repositories/prorrateo/centro_costo.repository');

async function listarCentrosCosto() {

    return await centro_costoRepository.getCentrosCosto();

}
async function obtenerProrrateo(id_detalle) {

    return await centro_costoRepository.getProrrateo(id_detalle);
}
module.exports = { listarCentrosCosto, obtenerProrrateo };