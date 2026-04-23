const {getConnection} = require('../config2/db');

async function login(username) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute('CALL usp_getUsuario(?)', [username]);
        return rows[0];
    } catch (error) {
        console.error("Error al ejecutar usp_getUsuario:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
async function putIntentos(p_valido, p_nombreusuario,p_nuevosIntentos) {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute('CALL usp_mantCantidadIntentos(?, ?,?)', [p_valido, p_nombreusuario, p_nuevosIntentos]);
        
    }
    catch (error) {
        console.error("Error al ejecutar usp_mantCantidadIntentos:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    login,
    putIntentos
};