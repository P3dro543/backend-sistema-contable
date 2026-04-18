
const {getConnection} = require('../../config2/db');

async function findAll() {
    const conn = await getConnection();
    try {
        // Ejecutamos el SP usando CALL
        const [rows] = await conn.execute('CALL usp_getPeriodos()');
        
        return rows[0]; 
    } catch (error) {
        console.error("Error al ejecutar usp_getPeriodos:", error);
        throw error;
    } finally {
        // Siempre liberamos la conexión
        if (conn) conn.release();
    }
}
module.exports = {
    findAll
};