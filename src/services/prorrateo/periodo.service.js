// periodo.service.js
const periodoRepository = require('../../repositories/periodos.repository');

async function listarPeriodos() {
    try {
        const periodos = await periodoRepository.findAll();
        

        if (!periodos || periodos.length === 0) {
            
            return { exito: true, data: [], mensaje: "No se encontraron periodos registrados." };
        }

        return { exito: true, data: periodos };
    } catch (error) {
        
        console.error("Error en periodoService.listarPeriodos:", error);
        throw new Error("Error interno al obtener los periodos.");
    }
}

module.exports = { listarPeriodos };