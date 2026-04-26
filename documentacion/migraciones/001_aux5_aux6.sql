-- Migración AUX5/AUX6 (tablas auxiliares + prorrateo + constraints)
-- Base: esquema existente del proyecto (ej. `sistema_contable`)
--
-- Nota: este script NO modifica tablas existentes; solo crea las faltantes
-- y agrega relaciones/índices para integridad referencial.

SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- AUX5: Terceros
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

-- =========================
-- AUX6: Centros de costo
-- =========================

CREATE TABLE IF NOT EXISTS `centros_costo` (
  `id_centro_costo` INT NOT NULL AUTO_INCREMENT,
  `codigo`          VARCHAR(50) NOT NULL,
  `nombre`          VARCHAR(100) NOT NULL,
  `descripcion`     VARCHAR(200) DEFAULT NULL,
  `estado`          TINYINT DEFAULT '1',
  PRIMARY KEY (`id_centro_costo`),
  UNIQUE KEY `uq_centros_costo_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================
-- AUX11: Direcciones de tercero
-- =========================

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

-- =========================
-- AUX12: Contactos de tercero
-- =========================
-- OJO: el backend actual usa la tabla `contactos` (no `contactos_tercero`)

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
-- AUX6: Estructura relacional asiento_detalle ↔ terceros/centros de costo
-- =========================
-- El proyecto ya maneja líneas en `asiento_detalle` (id_detalle).
-- Las siguientes tablas guardan el prorrateo por línea.

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

