const usuarioRepository = require('../repositories/login.repository');
const modeloUsuario = require('../models/usuario');
async function login(username) {
    const dbRow = await usuarioRepository.login(username);
    console.log("Resultado de la consulta a la base de datos:", dbRow);
    // Si no hay datos, retornamos null de una vez
    if (!dbRow || dbRow.length === 0) {
        return null;
    }

    // Si hay datos, construimos el objeto limpio
    
   return dbRow;

}
async function putIntentos(p_valido, p_nombreusuario, p_nuevosIntentos) {
    await usuarioRepository.putIntentos(p_valido, p_nombreusuario, p_nuevosIntentos);
}
module.exports = {
    login,
    putIntentos
};