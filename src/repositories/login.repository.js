const {getConnection} = require('../config2/db');

async function login(username) {
    const conn = await getConnection();
    try {
        // En lugar de usar el SP incompleto, hacemos un JOIN para traer todo:
        // Nombre, Apellido y el Rol desde la tabla usuario_rol
        const [rows] = await conn.execute(`
            SELECT u.*, ur.id_rol 
            FROM usuarios u
            LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
            WHERE u.username = ?
        `, [username]);
        
        return rows; // Retornamos las filas encontradas
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

async function putIntentos(p_valido, p_nombreusuario, p_nuevosIntentos) {
    const conn = await getConnection();
    try {
        // Mantenemos este SP si Pedro lo tiene para los intentos
        await conn.execute('CALL usp_mantCantidadIntentos(?, ?, ?)', [p_valido, p_nombreusuario, p_nuevosIntentos]);
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