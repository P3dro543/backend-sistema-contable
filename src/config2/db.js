const mysql = require("mysql2/promise");

// Configuración del pool usando variables de entorno.
// Soporta fallback a valores legacy si faltan envs (evita romper despliegues existentes).
const pool = mysql.createPool({
  host: process.env.DB_HOST || "tiusr15pl.cuc-carrera-ti.ac.cr",
  user: process.env.DB_USER || "Feli86ine",
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "Feli86ine",
  database: process.env.DB_NAME || "tiusr15pl_sis_grupo2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Función para obtener una conexión del pool
 * Esta es la función que tus repositorios están importando
 */
async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  getConnection,
};

