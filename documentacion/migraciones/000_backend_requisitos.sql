-- Requisitos mínimos de BD para que el backend no falle
-- MySQL 8.0+ (probado con sintaxis 8.0.45)
--
-- Este script:
-- 1) Crea tablas faltantes usadas por AUX5/AUX6/AUX11/AUX12 y prorrateo
-- 2) Agrega columnas faltantes usadas por reportes/prorrateo/login
-- 3) Crea/reescribe Stored Procedures que el backend llama
--
-- IMPORTANTE:
-- - Ejecutar en la base del proyecto (por ejemplo: `sistema_contable`)
-- - Los SPs se recrean con `DROP PROCEDURE IF EXISTS` para evitar errores

SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- Tablas AUX5/AUX6/AUX11/AUX12
-- =========================

CREATE TABLE IF NOT EXISTS `terceros` (
  `id_tercero`      INT NOT NULL AUTO_INCREMENT,
  `nombre`          VARCHAR(100) NOT NULL,
  `identificacion`  VARCHAR(50) DEFAULT NULL,
  `telefono`        VARCHAR(50) DEFAULT NULL,
  `correo`          VARCHAR(100) DEFAULT NULL,
  `estado`          TINYINT DEFAULT '1',
  `tipo`            VARCHAR(50) NOT NULL DEFAULT 'Otro',
  PRIMARY KEY (`id_tercero`),
  KEY `idx_terceros_identificacion` (`identificacion`),
  KEY `idx_terceros_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `centros_costo` (
  `id_centro_costo` INT NOT NULL AUTO_INCREMENT,
  `codigo`          VARCHAR(50) NOT NULL,
  `nombre`          VARCHAR(100) NOT NULL,
  `descripcion`     VARCHAR(200) DEFAULT NULL,
  `estado`          TINYINT DEFAULT '1',
  PRIMARY KEY (`id_centro_costo`),
  UNIQUE KEY `uq_centros_costo_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `direcciones_tercero` (
  `id_direccion`      INT NOT NULL AUTO_INCREMENT,
  `id_tercero`        INT NOT NULL,
  `alias`             VARCHAR(100) DEFAULT NULL,
  `provincia`         VARCHAR(100) DEFAULT NULL,
  `canton`            VARCHAR(100) DEFAULT NULL,
  `distrito`          VARCHAR(100) DEFAULT NULL,
  `direccion_exacta`  VARCHAR(255) NOT NULL,
  `estado`            TINYINT NOT NULL DEFAULT '1',
  `principal`         TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_direccion`),
  KEY `fk_direcciones_tercero_tercero` (`id_tercero`),
  CONSTRAINT `fk_direcciones_tercero_tercero`
    FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nota: el backend usa `contactos` (no `contactos_tercero`)
CREATE TABLE IF NOT EXISTS `contactos` (
  `id_contacto`    INT NOT NULL AUTO_INCREMENT,
  `id_tercero`     INT NOT NULL,
  `nombre`         VARCHAR(100) NOT NULL,
  `cargo`          VARCHAR(100) DEFAULT NULL,
  `email`          VARCHAR(100) DEFAULT NULL,
  `telefono`       VARCHAR(50) DEFAULT NULL,
  `tipo_contacto`  VARCHAR(50) DEFAULT NULL,
  `estado`         VARCHAR(20) DEFAULT 'Activo',
  PRIMARY KEY (`id_contacto`),
  KEY `fk_contactos_tercero` (`id_tercero`),
  CONSTRAINT `fk_contactos_tercero`
    FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================
-- Columnas faltantes (evita errores por SELECTs)
-- =========================

-- ReporteTerceroRepository usa a.codigo (en algunos dumps existe solo `consecutivo`)
ALTER TABLE `asientos`
  ADD COLUMN IF NOT EXISTS `codigo` VARCHAR(50) NULL AFTER `id_asiento`;

-- TerceroRepository.hasRelations consulta asientos.id_tercero
ALTER TABLE `asientos`
  ADD COLUMN IF NOT EXISTS `id_tercero` INT NULL AFTER `id_periodo`;

-- ReporteTerceroRepository usa ad.descripcion
ALTER TABLE `asiento_detalle`
  ADD COLUMN IF NOT EXISTS `descripcion` VARCHAR(255) NULL AFTER `monto`;

-- Login usa intentos (si no existe)
ALTER TABLE `usuarios`
  ADD COLUMN IF NOT EXISTS `intentos` INT NOT NULL DEFAULT 0 AFTER `password`;

-- FK opcional asientos.id_tercero -> terceros
-- (si la tabla terceros no existía antes, este ALTER no fallará ahora)
ALTER TABLE `asientos`
  ADD CONSTRAINT `fk_asientos_tercero`
  FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- =========================
-- Tablas de prorrateo (AUX6)
-- =========================

CREATE TABLE IF NOT EXISTS `prorrateo_tercero` (
  `id_prorrateo_tercero` INT NOT NULL AUTO_INCREMENT,
  `id_detalle`           INT NOT NULL,
  `id_tercero`           INT NOT NULL,
  `monto`                DECIMAL(14,2) NOT NULL,
  `es_principal`         TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_prorrateo_tercero`),
  KEY `idx_pt_detalle` (`id_detalle`),
  KEY `idx_pt_tercero` (`id_tercero`),
  CONSTRAINT `fk_pt_detalle`
    FOREIGN KEY (`id_detalle`) REFERENCES `asiento_detalle` (`id_detalle`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pt_tercero`
    FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`id_tercero`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `prorrateo_cc` (
  `id_prorrateo_cc`  INT NOT NULL AUTO_INCREMENT,
  `id_detalle`       INT NOT NULL,
  `id_centro_costo`  INT NOT NULL,
  `monto`            DECIMAL(14,2) NOT NULL,
  `es_principal`     TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_prorrateo_cc`),
  KEY `idx_pcc_detalle` (`id_detalle`),
  KEY `idx_pcc_cc` (`id_centro_costo`),
  CONSTRAINT `fk_pcc_detalle`
    FOREIGN KEY (`id_detalle`) REFERENCES `asiento_detalle` (`id_detalle`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pcc_cc`
    FOREIGN KEY (`id_centro_costo`) REFERENCES `centros_costo` (`id_centro_costo`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- Stored Procedures requeridos por el backend
-- =========================

DELIMITER $$

-- AUX3: menú por rol
DROP PROCEDURE IF EXISTS `sp_obtener_pantallas_por_rol`$$
CREATE PROCEDURE `sp_obtener_pantallas_por_rol`(IN p_id_rol INT)
BEGIN
  SELECT p.id_pantalla, p.nombre, p.descripcion, p.ruta, p.estado
  FROM rol_pantalla rp
  INNER JOIN pantallas p ON rp.id_pantalla = p.id_pantalla
  WHERE rp.id_rol = p_id_rol
    AND p.estado = 1
  ORDER BY p.id_pantalla ASC;
END$$

-- Prorrateo: listar centros de costo
DROP PROCEDURE IF EXISTS `usp_getCentroCosto`$$
CREATE PROCEDURE `usp_getCentroCosto`()
BEGIN
  SELECT id_centro_costo, codigo, nombre, descripcion, estado
  FROM centros_costo
  WHERE estado = 1
  ORDER BY nombre ASC;
END$$

-- Prorrateo: listar terceros
DROP PROCEDURE IF EXISTS `usp_getTerceros`$$
CREATE PROCEDURE `usp_getTerceros`()
BEGIN
  SELECT id_tercero, nombre, identificacion, telefono, correo, estado, tipo
  FROM terceros
  WHERE estado = 1
  ORDER BY nombre ASC;
END$$

-- Prorrateo: leer prorrateo CC por línea
DROP PROCEDURE IF EXISTS `sp_leer_prorrateo_cc`$$
CREATE PROCEDURE `sp_leer_prorrateo_cc`(IN p_id_detalle INT)
BEGIN
  SELECT
    pcc.id_prorrateo_cc,
    pcc.id_detalle,
    pcc.id_centro_costo,
    cc.codigo,
    cc.nombre,
    pcc.monto,
    pcc.es_principal
  FROM prorrateo_cc pcc
  INNER JOIN centros_costo cc ON pcc.id_centro_costo = cc.id_centro_costo
  WHERE pcc.id_detalle = p_id_detalle
  ORDER BY pcc.es_principal DESC, pcc.id_prorrateo_cc ASC;
END$$

-- Prorrateo: leer prorrateo tercero por línea
DROP PROCEDURE IF EXISTS `sp_leer_prorrateo_tercero`$$
CREATE PROCEDURE `sp_leer_prorrateo_tercero`(IN p_id_detalle INT)
BEGIN
  SELECT
    pt.id_prorrateo_tercero,
    pt.id_detalle,
    pt.id_tercero,
    t.nombre AS tercero_nombre,
    pt.monto,
    pt.es_principal
  FROM prorrateo_tercero pt
  INNER JOIN terceros t ON pt.id_tercero = t.id_tercero
  WHERE pt.id_detalle = p_id_detalle
  ORDER BY pt.es_principal DESC, pt.id_prorrateo_tercero ASC;
END$$

-- Validación de asiento (usado antes de guardar prorrateo)
DROP PROCEDURE IF EXISTS `sp_obtener_info_validacion_asiento`$$
CREATE PROCEDURE `sp_obtener_info_validacion_asiento`(IN p_id_detalle INT)
BEGIN
  SELECT
    ad.id_detalle,
    ad.monto AS monto_linea,
    ea.nombre AS estado_nombre,
    a.id_asiento,
    a.id_estado
  FROM asiento_detalle ad
  INNER JOIN asientos a ON ad.id_asiento = a.id_asiento
  INNER JOIN estados_asiento ea ON a.id_estado = ea.id_estado
  WHERE ad.id_detalle = p_id_detalle
  LIMIT 1;
END$$

-- Guardar prorrateo CC (esPrimero=1 limpia prorrateo anterior del detalle)
DROP PROCEDURE IF EXISTS `sp_guardar_prorrateo_cc`$$
CREATE PROCEDURE `sp_guardar_prorrateo_cc`(
  IN p_id_detalle INT,
  IN p_id_centro_costo INT,
  IN p_monto DECIMAL(14,2),
  IN p_esPrimero TINYINT
)
BEGIN
  IF p_esPrimero = 1 THEN
    DELETE FROM prorrateo_cc WHERE id_detalle = p_id_detalle;
  END IF;

  INSERT INTO prorrateo_cc (id_detalle, id_centro_costo, monto, es_principal)
  VALUES (p_id_detalle, p_id_centro_costo, p_monto, p_esPrimero);
END$$

-- Guardar prorrateo por tercero (esPrimero=1 limpia prorrateo anterior del detalle)
DROP PROCEDURE IF EXISTS `sp_guardar_prorrateo_tercero`$$
CREATE PROCEDURE `sp_guardar_prorrateo_tercero`(
  IN p_id_detalle INT,
  IN p_id_tercero INT,
  IN p_monto DECIMAL(14,2),
  IN p_esPrimero TINYINT
)
BEGIN
  IF p_esPrimero = 1 THEN
    DELETE FROM prorrateo_tercero WHERE id_detalle = p_id_detalle;
  END IF;

  INSERT INTO prorrateo_tercero (id_detalle, id_tercero, monto, es_principal)
  VALUES (p_id_detalle, p_id_tercero, p_monto, p_esPrimero);
END$$

-- Repositorio prorrateo: asientos por periodo
DROP PROCEDURE IF EXISTS `usp_getAsientosByPeriodo`$$
CREATE PROCEDURE `usp_getAsientosByPeriodo`(IN p_id_periodo INT)
BEGIN
  SELECT
    a.id_asiento,
    a.codigo,
    a.consecutivo,
    a.fecha,
    a.referencia,
    a.id_estado,
    a.id_periodo,
    a.id_tercero
  FROM asientos a
  WHERE a.id_periodo = p_id_periodo
  ORDER BY a.fecha DESC, a.id_asiento DESC;
END$$

-- Repositorio prorrateo: detalle de asiento
DROP PROCEDURE IF EXISTS `usp_getDetalleAsiento`$$
CREATE PROCEDURE `usp_getDetalleAsiento`(IN p_id_asiento INT)
BEGIN
  SELECT
    ad.id_detalle,
    ad.id_asiento,
    ad.id_cuenta,
    ad.tipo_movimiento,
    ad.monto,
    ad.descripcion
  FROM asiento_detalle ad
  WHERE ad.id_asiento = p_id_asiento
  ORDER BY ad.id_detalle ASC;
END$$

-- Login: obtener usuario (backend espera: username, password, intentos, nombre, apellido)
DROP PROCEDURE IF EXISTS `usp_getUsuario`$$
CREATE PROCEDURE `usp_getUsuario`(IN p_username VARCHAR(50))
BEGIN
  SELECT
    u.username,
    u.password,
    u.intentos,
    u.nombre,
    u.apellido
  FROM usuarios u
  WHERE u.username = p_username
    AND u.estado = 1
  LIMIT 1;
END$$

-- Login: mantener intentos (p_valido=1 resetea)
DROP PROCEDURE IF EXISTS `usp_mantCantidadIntentos`$$
CREATE PROCEDURE `usp_mantCantidadIntentos`(
  IN p_valido TINYINT,
  IN p_nombreusuario VARCHAR(50),
  IN p_nuevosIntentos INT
)
BEGIN
  IF p_valido = 1 THEN
    UPDATE usuarios
    SET intentos = 0
    WHERE username = p_nombreusuario;
  ELSE
    UPDATE usuarios
    SET intentos = p_nuevosIntentos,
        estado = IF(p_nuevosIntentos >= 3, 0, estado)
    WHERE username = p_nombreusuario;
  END IF;
END$$

DELIMITER ;

