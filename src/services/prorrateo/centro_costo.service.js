const centro_costoRepository = require('../../repositories/prorrateo/centro_costo.repository');

async function listarCentrosCosto() {

    return await centro_costoRepository.getCentrosCosto();

}
module.exports = { listarCentrosCosto };