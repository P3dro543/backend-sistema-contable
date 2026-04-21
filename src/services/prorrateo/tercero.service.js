const terceroREpository = require('../../repositories/prorrateo/tercero.repository');

async function listarTerceros() {
    const terceros = await terceroREpository.getTerceros();
    return terceros;
}
async function obtenerProrrateo(id_detalle) {
    return await terceroREpository.getProrrateo(id_detalle);
}
module.exports = { listarTerceros, obtenerProrrateo };