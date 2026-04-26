const jwt = require("jsonwebtoken");

function extraerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== "string") return null;

  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;
  return token || null;
}

function jwtMiddleware(req, res, next) {
  const token = extraerToken(req);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Falta JWT (Authorization: Bearer <token>)." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET no está configurado en el servidor." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "JWT inválido o expirado." });
  }
}

module.exports = jwtMiddleware;

