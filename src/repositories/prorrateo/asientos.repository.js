const {getConnection} = require('../../config2/db');

async function getAsientosByPeriodo(idPeriodo) {
    const conn = await getConnection();
    try {//usp_getAsientosbyPeriodo
        const [rows] = await conn.execute('CALL usp_getAsientosByPeriodo(?)', [idPeriodo]);
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar usp_getAsientosByPeriodo:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
async function getDetalleAsiento(idAsiento) {
    const conn = await getConnection();
    try{
        const [rows] = await conn.execute('CALL usp_getDetalleAsiento(?)', [idAsiento]);//usp_getDetalleAsiento
        return rows[0];
    }
    catch(error)    {
        console.error("Error al ejecutar usp_getDetalleAsiento:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
module.exports = {
    getAsientosByPeriodo,
    getDetalleAsiento
};