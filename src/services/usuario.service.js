const usuarioRepository = require("../repositories/login.repository");

async function login(username) {
  const dbRow = await usuarioRepository.login(username);
  if (!dbRow || dbRow.length === 0) {
    return null;
  }
  return dbRow;
}

async function getUserInfoByUsername(username) {
  return await usuarioRepository.getUserInfoByUsername(username);
}

async function putIntentos(p_valido, p_nombreusuario, p_nuevosIntentos) {
  await usuarioRepository.putIntentos(p_valido, p_nombreusuario, p_nuevosIntentos);
}

module.exports = {
  login,
  getUserInfoByUsername,
  putIntentos,
};

