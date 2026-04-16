// periodo.controller.js
const periodoService = require('../../services/prorrateo/periodo.service');

async function getPeriodos(req, res) {
    try {
        console.log("Llamada a getPeriodos recibida.");
        const resultado = await periodoService.listarPeriodos();
        console.log("Resultado de listarPeriodos:", resultado);
        if (resultado.data.length === 0) {
            // 204 No Content es muy técnico, 200 con array vacío es estándar.
            // Pero si es crítico que existan, podrías usar 404.
            return res.status(200).json(resultado);
        }

        // 200 OK: Todo salió bien
        return res.status(200).json(resultado.data);

    } catch (error) {
        // 500 Error: Algo explotó en la base de datos o el código
        return res.status(500).json({
            exito: false,
            mensaje: "Hubo un problema al procesar la solicitud.",
            error: error.message // En producción, mejor no enviar el stack trace
        });
    }
}
module.exports = {
    getPeriodos
};  