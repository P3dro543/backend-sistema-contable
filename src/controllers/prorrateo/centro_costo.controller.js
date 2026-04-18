const centroCostoService = require('../../services/prorrateo/centro_costo.service');
const ApiResponse = require('../../models/api.response');

async function getCentrosCosto(req, res) {
    try {
        const centrosCosto = await centroCostoService.listarCentrosCosto();
        
        // Validamos si hay datos
        if (!centrosCosto || centrosCosto.length === 0) {
            return ApiResponse.error(res, "No se encontraron centros de costo.", 404, "Recurso no encontrado");
        }

        // Respuesta exitosa
        return ApiResponse.success(res, "Centros de costo obtenidos correctamente", centrosCosto);

    } catch (error) {
        // Error de servidor
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, error.message);
    }
}

module.exports = {
    getCentrosCosto
};