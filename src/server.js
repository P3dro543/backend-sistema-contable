<<<<<<< Updated upstream
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});
=======
require("dotenv").config();

const app = require("./app");
>>>>>>> Stashed changes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

