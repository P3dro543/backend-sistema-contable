const {getConnection} = require('../../config2/db');

async function getCentrosCosto() {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute('CALL usp_getCentroCosto()');
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar usp_getCentroCosto:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
module.exports = {
    getCentrosCosto
};