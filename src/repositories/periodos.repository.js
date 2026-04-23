
const {getConnection} = require('../config2/db');
//const periodoRepository = require('../../repositories/periodos.repository');
async function findAll() {
    const conn = await getConnection();
    try {
        // Ejecutamos el SP usando CALL
        const [rows] = await conn.execute('CALL usp_getPeriodos()');
        
        /* IMPORTANTE: MariaDB/MySQL devuelven un array de arrays al usar CALL.
            El primer elemento (rows[0]) contiene los registros.
            El segundo elemento contiene metadatos del estado de la ejecución.
        */
        return rows[0]; 
    } catch (error) {
        console.error("Error al ejecutar usp_getPeriodos:", error);
        throw error;
    } finally {
        // Siempre liberamos la conexión, incluso si hay error
        if (conn) conn.release();
    }
}
module.exports = {
    findAll
};