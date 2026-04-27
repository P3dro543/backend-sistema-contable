const service = require('../services/Centrocosto.service');
const { registrarBitacora } = require('../utils/bitacora.util');

// ─── Helper para nombre de usuario desde JWT ──────────────────────────────────
const getUsuario = (req) =>
  req.user?.username || req.user?.nombre || 'desconocido';

// ─── GET /centros-costo?pagina=1&porPagina=10 ────────────────────────────────
const listar = async (req, res) => {
  try {
    const pagina    = parseInt(req.query.pagina)    || 1;
    const porPagina = parseInt(req.query.porPagina) || 10;

    const resultado = await service.listar(pagina, porPagina);

    await registrarBitacora(
      getUsuario(req),
      'CONSULTA_CENTROS_COSTO',
      { pagina, por_pagina: porPagina }
    );

    return res.json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

// ─── GET /centros-costo/:id ───────────────────────────────────────────────────
const obtener = async (req, res) => {
  try {
    const cc = await service.obtener(req.params.id);
    return res.json(cc);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

// ─── POST /centros-costo ──────────────────────────────────────────────────────
const crear = async (req, res) => {
  try {
    const nuevo = await service.crear(req.body);

    await registrarBitacora(
      getUsuario(req),
      'CREAR_CENTRO_COSTO',
      nuevo
    );

    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

// ─── PUT /centros-costo/:id ───────────────────────────────────────────────────
const actualizar = async (req, res) => {
  try {
    const { anterior, nuevo } = await service.actualizar(req.params.id, req.body);

    await registrarBitacora(
      getUsuario(req),
      'ACTUALIZAR_CENTRO_COSTO',
      { anterior, nuevo }
    );

    return res.json(nuevo);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

// ─── DELETE /centros-costo/:id ────────────────────────────────────────────────
const eliminar = async (req, res) => {
  try {
    const eliminado = await service.eliminar(req.params.id);

    await registrarBitacora(
      getUsuario(req),
      'ELIMINAR_CENTRO_COSTO',
      eliminado
    );

    return res.json({ message: 'Centro de costo eliminado correctamente.' });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

// ─── GET /centros-costo/reporte ───────────────────────────────────────────────
// Query params: id_centro_costo, fecha_inicio, fecha_fin, id_periodo,
//               id_estado (opcional), pagina, porPagina
const reporte = async (req, res) => {
  try {
    const {
      id_centro_costo,
      fecha_inicio,
      fecha_fin,
      id_periodo,
      id_estado,
      pagina    = 1,
      porPagina = 10,
    } = req.query;

    const resultado = await service.reporte({
      id_centro_costo: parseInt(id_centro_costo),
      fecha_inicio,
      fecha_fin,
      id_periodo: id_periodo ? parseInt(id_periodo) : null,
      id_estado:  id_estado  ? parseInt(id_estado)  : null,
      pagina:     parseInt(pagina),
      porPagina:  parseInt(porPagina),
    });

    await registrarBitacora(
      getUsuario(req),
      'REPORTE_CENTRO_COSTO',
      {
        id_centro_costo,
        fecha_inicio,
        fecha_fin,
        id_periodo,
        id_estado,
        pagina,
        por_pagina: porPagina,
      }
    );

    return res.json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Error interno.' });
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar, reporte };