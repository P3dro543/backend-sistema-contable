const terceroREpository = require('../../repositories/prorrateo/tercero.repository');

async function listarTerceros() {
    const terceros = await terceroREpository.getTerceros();
    return terceros;
}
module.exports = { listarTerceros };