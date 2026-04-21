const express = require('express');
const periodoRoutes = require('./routes/periodo.routes');
const asientoRoutes = require('./routes/asientos.routes');
const terceroCentroCostoRoutes = require('./routes/tercero.centro_costo.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});
app.get('/test', (req, res) => {
  res.send('test funcionando');
});
// Rutas para terceros y centros de costo

app.use('/api/prorrateo', terceroCentroCostoRoutes);
//api usuarios

app.use('/api/usuarios', usuarioRoutes);
//api asientos
app.use('/api/asientos', asientoRoutes);
app.use('/api/asientos/detalle', asientoRoutes);
//api periodos
app.use('/api/periodos', periodoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});//D:\A_CUC\IC-2026\Adm Sitios Web\prueba react\apis\backend-sistema-contable\src\server.js