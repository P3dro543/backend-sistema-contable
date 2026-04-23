const terceroService = require('../../services/prorrateo/tercero.service');
const ApiResponse = require('../../models/api.response');
const { registrarBitacora } = require('../../utils/bitacora.util');
const {getConnection} = require('../../config2/db');
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
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500, 'error del servidor');
    }
}
async function getProrrateo(req, res) {
    try {
        const { id_detalle } = req.params;
        const prorrateo = await terceroService.obtenerProrrateo(id_detalle);
       
        if (!prorrateo || prorrateo.length === 0) {
            return ApiResponse.error(res, "No se encontró el prorrateo.", 404, "Recurso no encontrado");
        }
        return ApiResponse.success(res, "Prorrateo obtenido correctamente", prorrateo);
    } catch (error) {
        return ApiResponse.error(res, "Hubo un problema al procesar la solicitud.", 500,'error del servidor');
    }
}
const guardarProrrateo = async (req, res) => {
    const { id_detalle, distribucion, tipo } = req.body;
    let conn;

    try {
        conn = await getConnection();

        // 1. Validar Estado del Asiento y obtener Monto Original
        const [info] = await conn.execute('CALL sp_obtener_info_validacion_asiento(?)', [id_detalle]);
        const validacion = info[0][0];

        if (!validacion) {
            return res.status(404).json({ exito: false, mensaje: "No se encontró el detalle del asiento." });
        }

        const estado = validacion.estado_nombre.toLowerCase();
        if (!estado.includes('borrador') && !estado.includes('pendiente')) {
            return res.status(403).json({ 
                exito: false, 
                mensaje: `No se puede prorratear: el asiento está en estado ${validacion.estado_nombre}` 
            });
        }

        // 2. Validar Sumatoria
        const sumaDistribucion = distribucion.reduce((acc, item) => acc + parseFloat(item.monto), 0);
        const montoOriginal = parseFloat(validacion.monto_linea);

        if (Math.abs(sumaDistribucion - montoOriginal) > 0.01) {
            return res.status(400).json({ 
                exito: false, 
                mensaje: `La suma (${sumaDistribucion.toFixed(2)}) no coincide con el total (${montoOriginal.toFixed(2)})` 
            });
        }

        // 3. Validar existencia de IDs (Fuera del bucle de guardado para ser más eficiente)
        if (tipo === 'TERCERO') {
            for (const item of distribucion) {
                const [existe] = await conn.execute('SELECT id_tercero FROM terceros WHERE id_tercero = ?', [item.id_tercero]);
                if (existe.length === 0) {
                    return res.status(400).json({ exito: false, mensaje: `Error: tercero con ID ${item.id_tercero} no existe.` });
                }
            }
        } else if (tipo === 'CC') {
            for (const item of distribucion) {
                const [existe] = await conn.execute('SELECT id_centro_costo FROM centros_costo WHERE id_centro_costo = ?', [item.id_centro_costo]);
                if (existe.length === 0) {
                    return res.status(400).json({ exito: false, mensaje: `Error: Centro de Costo con ID ${item.id_centro_costo} no existe.` });
                }
            }
        } else {
            return res.status(400).json({ exito: false, mensaje: "Tipo de prorrateo no válido" });
        }

        // 4. Proceso de Guardado
        for (let i = 0; i < distribucion.length; i++) {
            const item = distribucion[i];
            const esPrimero = (i === 0) ? 1 : 0;

            if (tipo === 'TERCERO') {
                await conn.execute('CALL sp_guardar_prorrateo_tercero(?, ?, ?, ?)', 
                    [id_detalle, item.id_tercero, item.monto, esPrimero]);
            } else {
                await conn.execute('CALL sp_guardar_prorrateo_cc(?, ?, ?, ?)', 
                    [id_detalle, item.id_centro_costo, item.monto, esPrimero]);
            }
        }

        // Registro en bitácora
        await registrarBitacora(
            'Sistema', // Idealmente el usuario de la sesión, pero por ahora genérico
            `Guardado de prorrateo para detalle ID ${id_detalle} (Tipo: ${tipo})`,
            { id_detalle, distribucion, tipo }
        );

        res.json({ exito: true, mensaje: "Prorrateo guardado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
    } finally {
        // MUY IMPORTANTE: Cerramos la conexión para evitar el error de "max users"
        if (conn) conn.release(); 
    }
};
module.exports = {
    getTerceros,
    getProrrateo,
    guardarProrrateo
};