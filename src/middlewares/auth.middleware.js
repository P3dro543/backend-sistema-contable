// src/middlewares/auth.middleware.js

const verificarToken = (req, res, next) => {
    console.log("🔐 Middleware de auth (temporal)");
    next(); // deja pasar todo
};

module.exports = { verificarToken };