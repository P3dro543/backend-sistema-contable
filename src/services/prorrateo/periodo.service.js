// periodo.service.js
const periodoRepository = require('../../repositories/periodos.repository');

async function listarPeriodos() {
    try {
        const periodos = await periodoRepository.findAll();
        



        return periodos;
    } catch (error) {
        
        console.error("Error en periodoService.listarPeriodos:", error);
        throw new Error("Error interno al obtener los periodos.");
    }
}

module.exports = { listarPeriodos };