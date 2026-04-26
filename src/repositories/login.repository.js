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

async function getUserInfoByUsername(username) {
    const conn = await getConnection();
    try {
        const [[row]] = await conn.execute(
            `SELECT u.id_usuario, u.username, u.nombre, u.apellido, u.correo,
                    r.id_rol, r.nombre AS rol_nombre
             FROM usuarios u
             INNER JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             INNER JOIN roles r        ON ur.id_rol     = r.id_rol
             WHERE u.username = ?
             LIMIT 1`,
            [username]
        );
        return row ?? null;
    } catch (error) {
        console.error("Error al ejecutar getUserInfoByUsername:", error);
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
    putIntentos,
    getUserInfoByUsername
};
