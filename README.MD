# TP-Backend (API) — Trabajo Integrador

Proyecto: API backend para la aplicación tipo "Slack" (Trabajo Integrador Full-Stack).

Resumen
- Backend implementado en Node.js + Express.
- Arquitectura en capas: routes → controllers → services → repositories.
- Autenticación: hashing con bcrypt, JWT y verificación por correo (nodemailer).
- Validación de entradas con Joi.
- Persistencia: MongoDB (Mongoose).
- Despliegue: Vercel (API pública).

Estado actual
- El código base provee: registro con verificación por email, login que devuelve JWT, CRUD de workspaces, canales y mensajes, middlewares de validación y autenticación JWT.
- CORS está habilitado tal como aparece en el repo (app.use(cors())).
- Los controladores manejan errores con try/catch y devuelven JSON consistente.

Requisitos previos
- Node.js >= 18
- npm
- Una instancia/cluster MongoDB accesible (Atlas u otro)

Instalación y ejecución local
1. Clonar el repo:
   git clone https://github.com/JFonseka17/TP-Backend.git
2. Instalar dependencias:
   npm install
3. Crear archivo `.env` en la raíz con las variables de entorno necesarias (ver sección "Variables de entorno" abajo).
4. Ejecutar en desarrollo:
   npm run dev
   (o)
   npm run nodemon-dev

Variables de entorno (resumen)
- MONGO_DB_CONNECTION_STRING — Cadena de conexión a MongoDB.
- JWT_SECRET — Secreto para firmar/verificar JWT.
- URL_FRONTEND — URL pública del frontend (usada en redirección tras verificación).
- URL_BACKEND — URL pública del backend (usada en links enviados por mail).
- GMAIL_USER — Cuenta remitente para nodemailer.
- GMAIL_PASSWORD — Contraseña o token de aplicación para la cuenta de correo.
- PORT — Puerto opcional para ejecución local.
- (Opcional) CORS_ORIGIN — Orígenes permitidos por CORS (si desean restringir).

Scripts (package.json)
- start: node ./src/main.js
- dev: node --watch ./src/main.js
- nodemon-dev: nodemon ./src/main.js

API Endpoints (base path: /api)

1) Auth — Registro / Verificación / Login
- POST /api/auth/register
  - Descripción: Registrar usuario; envía email de verificación.
  - Auth: No
  - Middleware: validateRequest(registerSchema)
  - Body (JSON):
    {
      "email": "user@example.com",
      "password": "contraseñaSegura",
      "name": "Nombre Usuario"
    }
  - Respuesta (201):
    {
      "ok": true,
      "message": "Usuario registrado con exito",
      "status": 201
    }

- GET /api/auth/verify-email/:verification_token
  - Descripción: Verifica el correo a través del token; redirige al frontend.
  - Auth: No
  - Parámetros: verification_token (path)
  - Respuesta: Redirección a `${URL_FRONTEND}/login?from=verified_email`

- POST /api/auth/login
  - Descripción: Autenticar y devolver JWT.
  - Auth: No
  - Middleware: validateRequest(loginSchema)
  - Body:
    {
      "email": "user@example.com",
      "password": "contraseña"
    }
  - Respuesta (200):
    {
      "ok": true,
      "message": "Usuario loguado con exito",
      "status": 200,
      "body": {
        "auth_token": "eyJhbGciOiJI..."
      }
    }

2) Member
- GET /api/member/confirm/:invitation_token
  - Descripción: Confirmación de invitación (miembro invitado).
  - Auth: No
  - Parámetros: invitation_token (path)

3) Workspace (rutas protegidas por JWT)
Todas las rutas usan `authMiddleware` y esperan header:
Authorization: Bearer <AUTH_TOKEN>

- GET /api/workspace/
  - Descripción: Obtener workspaces del usuario.
  - Respuesta (200): lista de workspaces en data.workspaces

- POST /api/workspace/
  - Descripción: Crear workspace.
  - Body:
    {
      "name": "Mi Workspace",
      "url_img": "https://..."
    }
  - Respuesta (201): data.workspace_created

- GET /api/workspace/:workspace_id/channels
  - Descripción: Obtener detalle del workspace y canales.
  - Parámetros: workspace_id
  - Respuesta (200): data.workspace_detail + data.channels

- POST /api/workspace/:workspace_id/channels
  - Descripción: Crear canal en workspace.
  - Middleware adicional: workspaceMiddleware(['admin']) (requiere rol admin).
  - Body:
    {
      "name": "Nombre del canal",
      "url_img": "https://..."
    }
  - Respuesta (201): data.channel_created

- POST /api/workspace/:workspace_id/channels/:channel_id/messages
  - Descripción: Crear mensaje en canal.
  - Middlewares: workspaceMiddleware(), channelMiddleware
  - Body:
    {
      "content": "Texto del mensaje"
    }
  - Respuesta (201): data.message (lista) y data.message_created

- GET /api/workspace/:workspace_id/channels/:channel_id/messages
  - Descripción: Obtener mensajes de un canal.
  - Respuesta (200): data.messages

- POST /api/workspace/:workspace_id/invite
  - Descripción: Invitar miembro (solo admin).
  - Body:
    {
      "email_invited": "invitado@example.com",
      "role_invited": "member"
    }
  - Respuesta (200): ok: true, message: "Invitación enviada correctamente"

- DELETE /api/workspace/:workspace_id/channels/:channel_id/messages/:message_id
  - Descripción: Eliminar un mensaje dentro de un canal.
  - Middlewares: authMiddleware, workspaceMiddleware(), channelMiddleware
  - Parámetros (path): workspace_id, channel_id, message_id
  - Autorización: la verificación se hace via middlewares (propietario del mensaje o permisos según implementacion del servicio/middleware)
  - Respuesta:
    - 204 No Content: eliminación exitosa
    - 404 Not Found: si no se encontró el mensaje
    - 401/403: si no hay autorización

- DELETE /api/workspace/:workspace_id/channels/:channel_id
  - Descripción: Eliminar un canal dentro de un workspace.
  - Middlewares: authMiddleware, workspaceMiddleware(['admin'])
  - Parámetros (path): workspace_id, channel_id
  - Respuesta:
    - 204 No Content: eliminación exitosa
    - 404 Not Found: si no se encontró el canal
    - 403: si el usuario no tiene rol 'admin' en el workspace

- DELETE /api/workspace/:workspace_id
  - Descripción: Eliminar un workspace completo.
  - Middlewares: authMiddleware, workspaceMiddleware(['admin'])
  - Parámetros (path): workspace_id
  - Respuesta:
    - 204 No Content: eliminación exitosa
    - 404 Not Found: si no se encontró el workspace
    - 403: si el usuario no tiene rol 'admin' en el workspace

Middlewares importantes
- validateRequest(schema): valida req.body con Joi y devuelve 400 con mensajes de validación.
- authMiddleware: valida header Authorization y decodifica JWT (400/401 en caso de token inválido o expirado).
- workspaceMiddleware / channelMiddleware: gestionan autorización/validación de recursos.

Ejemplos de uso (curl)

Registro:
```bash
curl -X POST https://<API_URL>/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass1234","name":"Nombre"}'
```

Login:
```bash
curl -X POST https://<API_URL>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass1234"}'
# Respuesta contiene auth_token
```

Crear workspace (con token):
```bash
curl -X POST https://<API_URL>/api/workspace \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -d '{"name":"Mi Workspace","url_img":""}'
```

Eliminar un mensaje (ejemplo curl):
```bash
curl -i -X DELETE "https://<API_URL>/api/workspace/<workspace_id>/channels/<channel_id>/messages/<message_id>" \
  -H "Authorization: Bearer <AUTH_TOKEN>"
```

Eliminar un canal (ejemplo curl, requiere rol admin):
```bash
curl -i -X DELETE "https://<API_URL>/api/workspace/<workspace_id>/channels/<channel_id>" \
  -H "Authorization: Bearer <AUTH_TOKEN>"
```

Eliminar un workspace (ejemplo curl, requiere rol admin):
```bash
curl -i -X DELETE "https://<API_URL>/api/workspace/<workspace_id>" \
  -H "Authorization: Bearer <AUTH_TOKEN>"
```

Despliegue
- El backend está configurado para desplegar en Vercel (ver vercel.json). Asegurate de configurar las variables de entorno en el panel de Vercel: MONGO_DB_CONNECTION_STRING, JWT_SECRET, GMAIL_USER, GMAIL_PASSWORD, URL_FRONTEND, URL_BACKEND, etc.

Autor: Juli.Dev