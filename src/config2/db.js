const mysql = require('mysql2/promise');

// Configuración de la conexión usando tus datos
const pool = mysql.createPool({
    host: 'tiusr15pl.cuc-carrera-ti.ac.cr',//tiusr15pl.cuc-carrera-ti.ac.cr
    user: 'Feli86ine',
    password: 'Feli86ine',
    database: 'tiusr15pl_sis_grupo2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Función para obtener una conexión del pool
 * Esta es la función que tus repositorios están importando
 */
async function getConnection() {
    return await pool.getConnection();
}

module.exports = {
    getConnection
};