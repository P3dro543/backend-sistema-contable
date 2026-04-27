require('dotenv').config();
const app = require('./app'); // ✅ Importa tu app con todas las rutas
const { getConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Función async para iniciar todo
const startServer = async () => {
    try {
        // 🔌 Probar conexión a la base de datos
        const db = await getConnection();
        await db.query('SELECT 1');
        console.log('✅ Conexión a la base de datos exitosa');

        // 🚀 Levantar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
    }
};

// Ejecutar servidor
startServer();