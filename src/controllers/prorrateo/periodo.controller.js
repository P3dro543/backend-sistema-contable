// periodo.controller.js
const periodoService = require('../../services/prorrateo/periodo.service');
const ApiResponse = require('../../models/api.response');

async function getPeriodos(req, res) {
    try {
        console.log("Llamada a getPeriodos recibida.");
        const resultado = await periodoService.listarPeriodos();
        console.log("Resultado de listarPeriodos:", resultado);
        if (!resultado || resultado.length === 0) {
            return ApiResponse.error(res, "No se encontraron periodos.", 404, "Recurso no encontrado");
        }

        // Respuesta exitosa
        return ApiResponse.success(res, "Periodos obtenidos correctamente", resultado);

    } catch (error) {
        // Error de servidor
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, error.message);
    }
}
module.exports = {
    getPeriodos
};  