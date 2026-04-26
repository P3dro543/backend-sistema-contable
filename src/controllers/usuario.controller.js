const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const usuarioService = require("../services/usuario.service");

async function login(req, res) {
  const { username, password } = req.body || {};

  if (!username) {
    return res.status(400).json({ message: "El campo 'username' es requerido." });
  }
  if (!password) {
    return res.status(400).json({ message: "El campo 'password' es requerido." });
  }

  try {
    const usuario = await usuarioService.login(username);
    if (!usuario || usuario.length === 0) {
      return res.status(404).json({ message: "Usuario y/o contraseña incorrectos." });
    }

    const usernameObtenido = usuario[0].username;
    const passwordObtenido = usuario[0].password;
    const intentosObtenidos = usuario[0].intentos;

    if (intentosObtenidos >= 3) {
      return res.status(403).json({ message: "Usuario bloqueado." });
    }

    const sesionValida = await validarSesion(password, passwordObtenido);
    if (!sesionValida) {
      await usuarioService.putIntentos(0, usernameObtenido, intentosObtenidos + 1);
      if (intentosObtenidos + 1 >= 3) {
        return res.status(403).json({ message: "Usuario bloqueado." });
      }
      return res.status(401).json({ message: "Usuario y/o contraseña incorrectos." });
    }

    await usuarioService.putIntentos(1, usernameObtenido, 0);

    const info = await usuarioService.getUserInfoByUsername(usernameObtenido);
    if (!info) {
      return res
        .status(500)
        .json({ message: "No se pudo obtener información de rol del usuario." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET no está configurado en el servidor." });
    }

    const payload = {
      id_usuario: info.id_usuario,
      username: info.username,
      nombre: info.nombre,
      apellido: info.apellido,
      id_rol: info.id_rol,
      rol_nombre: info.rol_nombre,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    return res.status(200).json({
      message: "Login exitoso.",
      token,
      usuario: payload,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}

async function validarSesion(passwordRecibida, passwordAlmacenada) {
  const passwordRecibidaHash = hashPassword(passwordRecibida);
  return passwordRecibidaHash === passwordAlmacenada;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password, "utf8").digest("base64");
}

module.exports = {
  login,
};

