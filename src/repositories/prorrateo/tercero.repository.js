const {getConnection} = require('../../config2/db');

async function getTerceros() {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute('CALL usp_getTerceros()');
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar usp_getTerceros:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
async function getProrrateo(id_detalle) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute('CALL sp_leer_prorrateo_tercero(?)', [id_detalle]);
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar sp_leer_prorrateo_tercero:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    getTerceros,
    getProrrateo
};
