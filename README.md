## Backend Sistema Contable

### Ejecutar

- Instalar dependencias: `npm install`
- Levantar API: `npm run dev` (o `npm start`)

Variables de entorno en `.env` (ejemplo incluido en este repo):
- `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`

### Postman

En `documentacion/postman/` hay:
- `documentacion/postman/sistema-contable.postman_collection.json`
- `documentacion/postman/sistema-contable.postman_environment.json`
- `documentacion/postman/felipe-gerald.postman_collection.json`
- `documentacion/postman/felipe-gerald.postman_environment.json`

Importá ambos en Postman, seleccioná el environment **Sistema Contable (local)** y ejecutá:
1) `POST /auth/login` (guarda `token` automáticamente)
2) `GET /usuarios/me` y `GET /usuarios/me/menu` (usan JWT)

### Base de datos

Script (dump) disponible en `documentacion/db_definitiva.sql`.

Migración AUX5/AUX6 (para crear tablas faltantes sin cambiar tablas actuales):
- `documentacion/migraciones/001_aux5_aux6.sql`

Script completo para que el backend no falle (tablas + columnas + SPs):
- `documentacion/migraciones/000_backend_requisitos.sql`
