const express = require('express');
const periodoRoutes = require('./routes/periodo.routes');
const app = express();

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});
//api periodos
app.use('/api/periodos', periodoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});