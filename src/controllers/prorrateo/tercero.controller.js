const terceroService = require('../../services/prorrateo/tercero.service');
const ApiResponse = require('../../models/api.response');
async function getTerceros(req, res) {
    try {
        const terceros = await terceroService.listarTerceros();
        
        if (!terceros || terceros.length === 0) {
            return ApiResponse.error(res, "No se encontraron terceros.", 404, "Recurso no encontrado");
        }

        // Respuesta exitosa
        return ApiResponse.success(res, "Terceros obtenidos correctamente", terceros);

    } catch (error) {
        // Error de servidor
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, error.message);
    }
}
module.exports = {
    getTerceros
};