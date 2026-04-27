const mysql = require('mysql2/promise');
require('dotenv').config();

// Usamos las mismas variables que Pedro para que todo apunte a la BD hosteada
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Función para obtener una conexión del pool
 * Mantenemos esta estructura porque el código de Felipe usa conn.release()
 */
async function getConnection() {
    return await pool.getConnection();
}

module.exports = {
    getConnection
};