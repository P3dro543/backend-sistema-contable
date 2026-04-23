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
async function getProrrateo(req, res) {
    try {
        const { id_detalle } = req.params;
        const prorrateo = await centroCostoService.obtenerProrrateo(id_detalle);
        console.log("Prorrateo obtenido:", prorrateo);
        if (!prorrateo || prorrateo.length === 0) {
            return ApiResponse.error(res, "No se encontró el prorrateo.", 404, "Recurso no encontrado");
        }

        // Respuesta exitosa
        return ApiResponse.success(res, "Prorrateo obtenido correctamente", prorrateo);

    } catch (error) {
        // Error de servidor
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, error.message);
    }
}
        

module.exports = {
    getCentrosCosto,
    getProrrateo
};
