//asiento controller.js
const asientoService = require('../../services/prorrateo/asiento.service');
const ApiResponse = require('../../models/api.response');

async function getAsientos(req, res) {
    try {
        const { idPeriodo } = req.params;
        
        const resultado = await asientoService.listarAsientos(idPeriodo);
        resultado.data = resultado;
        // Validamos si hay datos
        if (!resultado.data || resultado.data.length === 0) {
            return ApiResponse.error(res, "No se encontraron asientos para el periodo.", 404, "Recurso no encontrado");
        }

        // Respuesta exitosa
        return ApiResponse.success(res, "Asientos obtenidos correctamente", resultado.data);

    } catch (error) {
        // Error de servidor
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, error.message);
    }
}
async function getDetalleAsiento(req, res) {
    try {
        const { idAsiento } = req.params;

        const detalle = await asientoService.obtenerDetalleAsiento(idAsiento);
        //404    
        if (!detalle || detalle.length === 0) {
            return ApiResponse.error(res, "Asiento no encontrado.", 404, "Recurso no encontrado");
        }
        //200
        return ApiResponse.success(res, "Detalle del asiento obtenido correctamente", detalle);

    } catch (error) {
        //500
        return ApiResponse.error(res, "Error interno", 500, error.message);
    }
}

module.exports = { getAsientos, getDetalleAsiento };
