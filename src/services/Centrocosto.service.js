const repo = require('../repositories/centroCosto.repository');

// ─── LISTAR PAGINADO ─────────────────────────────────────────────────────────
const listar = async (pagina, porPagina) => {
  return repo.getAll(pagina, porPagina);
};

// ─── OBTENER UNO ─────────────────────────────────────────────────────────────
const obtener = async (id) => {
  const cc = await repo.getById(id);
  if (!cc) throw { status: 404, message: 'Centro de costo no encontrado.' };
  return cc;
};

// ─── CREAR ───────────────────────────────────────────────────────────────────
const crear = async (datos) => {
  const { codigo, nombre, descripcion, estado } = datos;

  // Validaciones
  if (!codigo || !nombre) {
    throw { status: 400, message: 'Código y nombre son requeridos.' };
  }
  if (nombre.length > 100) {
    throw { status: 400, message: 'El nombre no puede superar 100 caracteres.' };
  }
  if (descripcion && descripcion.length > 200) {
    throw { status: 400, message: 'La descripción no puede superar 200 caracteres.' };
  }

  // Código único
  const duplicado = await repo.existeCodigo(codigo);
  if (duplicado) {
    throw { status: 409, message: 'Ya existe un centro de costo con ese código.' };
  }

  const id_nuevo = await repo.create({ codigo, nombre, descripcion, estado: estado ?? 1 });
  return { id_centro_costo: id_nuevo, codigo, nombre, descripcion, estado: estado ?? 1 };
};

// ─── ACTUALIZAR ──────────────────────────────────────────────────────────────
const actualizar = async (id, datos) => {
  const anterior = await repo.getById(id);
  if (!anterior) throw { status: 404, message: 'Centro de costo no encontrado.' };

  const { codigo, nombre, descripcion, estado } = datos;

  if (!codigo || !nombre) {
    throw { status: 400, message: 'Código y nombre son requeridos.' };
  }
  if (nombre.length > 100) {
    throw { status: 400, message: 'El nombre no puede superar 100 caracteres.' };
  }
  if (descripcion && descripcion.length > 200) {
    throw { status: 400, message: 'La descripción no puede superar 200 caracteres.' };
  }

  // Verificar que el código no lo use otro registro
  const duplicado = await repo.existeCodigo(codigo, id);
  if (duplicado) {
    throw { status: 409, message: 'Ya existe un centro de costo con ese código.' };
  }

  await repo.update(id, { codigo, nombre, descripcion, estado });

  const nuevo = await repo.getById(id);
  return { anterior, nuevo };
};

// ─── ELIMINAR ────────────────────────────────────────────────────────────────
const eliminar = async (id) => {
  const cc = await repo.getById(id);
  if (!cc) throw { status: 404, message: 'Centro de costo no encontrado.' };

  const relacionado = await repo.tieneRelaciones(id);
  if (relacionado) {
    throw { status: 409, message: 'No se puede eliminar un registro con datos relacionados.' };
  }

  await repo.remove(id);
  return cc; // devolvemos el registro eliminado para la bitácora
};

// ─── REPORTE ─────────────────────────────────────────────────────────────────
const reporte = async (filtros) => {
  const { id_centro_costo } = filtros;
  if (!id_centro_costo) {
    throw { status: 400, message: 'Debe indicar el centro de costo.' };
  }

  // Validar que exista el centro de costo
  const cc = await repo.getById(id_centro_costo);
  if (!cc) throw { status: 404, message: 'Centro de costo no encontrado.' };

  return repo.getReporte(filtros);
};

module.exports = { listar, obtener, crear, actualizar, eliminar, reporte };