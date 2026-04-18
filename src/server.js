const express = require('express');
const periodoRoutes = require('./routes/periodo.routes');
const asientoRoutes = require('./routes/asientos.routes');
const terceroCentroCostoRoutes = require('./routes/tercero.centro_costo.routes');
const app = express();

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

// Rutas para terceros y centros de costo
app.use('/api/tercero-centro-costo', terceroCentroCostoRoutes);

//api asientos
app.use('/api/asientos', asientoRoutes);
app.use('/api/asientos/detalle', asientoRoutes);
//api periodos
app.use('/api/periodos', periodoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});