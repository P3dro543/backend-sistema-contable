const usuarioService = require('../services/usuario.service');
const usuarioModelo = require('../models/usuario');
async function login(req, res) {
    const datos = [];
    
    const { username } = req.body;
    console.log("Username recibido en el controlador:", username);
    var { password } = req.body;
    console.log("Password recibido en el controlador:", password);

    if (!username) {
        return res.status(400).json({ message: "El campo 'username' es requerido." });
    }
    try {
        const usuario = await usuarioService.login(username);
        if (!usuario || usuario.length === 0) {
            return res.status(404).json({ message: "Usuario y/o contraseña incorrectoss." });
        }
        var usernameObtenido = usuario[0].username;
        var passwordObtenido = usuario[0].password;
        var intentosObtenidos = usuario[0].intentos;
        console.log("intentosObtenidos:", intentosObtenidos);
        if(intentosObtenidos >= 3){
            console.log("intentosObtenidos:", intentosObtenidos);
            return res.status(403).json({ message: "Usuario bloqueado." });
        }
        if (!await ValidarSesion(password, passwordObtenido)) {
            await usuarioService.putIntentos(0, usernameObtenido, intentosObtenidos + 1);
            if(intentosObtenidos + 1 >= 3){
                return res.status(403).json({ message: "Usuario su usuario se ha bloqueado😂." });
            }
            return res.status(401).json({ message: "Usuario y/o contraseña incorrectos." });
        }
            await usuarioService.putIntentos(1, usernameObtenido, 0);
        
        
        return res.status(200).json({ message: "Login exitoso." });
    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}
async function ValidarSesion(passwordRecibida, passwordAlmacenada) {
    PasswordRecibida = hashPassword(passwordRecibida);
    return PasswordRecibida === passwordAlmacenada;
}
const crypto = require('crypto');

function hashPassword(password) {
    return crypto
        .createHash('sha256')      // Usamos el mismo algoritmo
        .update(password, 'utf8')  // Codificamos en UTF-8 como en C#
        .digest('base64');         // Salida en Base64
}


module.exports = {
    login
};