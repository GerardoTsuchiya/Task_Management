# Infuse — Backend

API REST del proyecto Infuse, construida con [NestJS](https://nestjs.com/) y [Prisma ORM](https://www.prisma.io/) sobre PostgreSQL. Expone endpoints para autenticación, proyectos, tareas, subtareas, etiquetas y notificaciones. Incluye documentación interactiva con Swagger.

---

## Tecnologías

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Node.js | ≥ 18 | Entorno de ejecución |
| NestJS | ^11 | Framework principal |
| TypeScript | ^5.7 | Lenguaje |
| Prisma ORM | ^7 | Acceso a base de datos |
| PostgreSQL | — | Base de datos |
| Passport + JWT | — | Autenticación |
| Bcrypt | ^6 | Hash de contraseñas |
| class-validator | ^0.15 | Validación de DTOs |
| Swagger | ^11 | Documentación de API |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- Una instancia de PostgreSQL accesible (local o Supabase)

---

## Instalación

```bash
cd Backend
npm install
```

---

## Variables de entorno

Crea un archivo `.env` en la carpeta `Backend/` con las siguientes variables:

```env
# Cadena de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/infuse_db"

# Secreto para firmar los tokens JWT
JWT_SECRET="tu_secreto_super_seguro"

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000
```

---

## Comandos disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run start:prod

# Compilar
npm run build

# Pruebas unitarias
npm run test

# Pruebas end-to-end
npm run test:e2e

# Cobertura de pruebas
npm run test:cov

# Linting y formato
npm run lint
npm run format
```

---

## Prisma — Base de datos

```bash
# Aplicar migraciones
npx prisma migrate dev

# Generar cliente (después de cambiar el schema)
npx prisma generate

# Explorador visual de la BD
npx prisma studio
```

---

## Documentación de la API (Swagger)

Con el servidor corriendo, accede a la documentación interactiva en:

```
http://localhost:3000/api/docs
```

Desde ahí puedes explorar todos los endpoints, ver los esquemas de request/response y probar llamadas autenticadas con Bearer JWT.

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| `auth` | Registro, login y validación de sesión (`/auth/register`, `/auth/login`, `/auth/me`) |
| `projects` | CRUD de proyectos e invitación de miembros |
| `tasks` | CRUD de tareas con prioridad, estado, fechas límite y asignación |
| `subtasks` | Subtareas anidadas dentro de una tarea |
| `labels` | Etiquetas personalizadas por usuario para clasificar tareas |
| `notifications` | Notificaciones de eventos (invitaciones, cambios de estado, etc.) |
| `prisma` | Servicio global de conexión a la base de datos |

---

## Estructura del proyecto

```
Backend/
├── src/
│   ├── auth/              # Autenticación JWT
│   ├── projects/          # Módulo de proyectos
│   ├── tasks/             # Módulo de tareas
│   ├── subtasks/          # Módulo de subtareas
│   ├── labels/            # Módulo de etiquetas
│   ├── notifications/     # Módulo de notificaciones
│   ├── prisma/            # Servicio de base de datos
│   ├── common/            # Decoradores y tipos compartidos
│   ├── app.module.ts      # Módulo raíz
│   └── main.ts            # Punto de entrada
├── prisma/
│   └── schema.prisma      # Esquema de la base de datos
├── test/                  # Pruebas end-to-end
├── .env                   # Variables de entorno (no incluir en git)
└── package.json
```

---

## Modelos de datos

```
User          → Usuarios del sistema
Project       → Proyectos creados por un usuario
ProjectMember → Miembros invitados a un proyecto (rol + estado)
Task          → Tareas con prioridad (LOW/MEDIUM/HIGH/URGENT)
              →   y estado (PENDING/IN_PROGRESS/COMPLETED)
Subtask       → Subtareas dentro de una tarea
Label         → Etiquetas personalizadas por usuario
TaskLabel     → Relación N:M entre tareas y etiquetas
Notification  → Notificaciones de eventos para un usuario
```

---

## Licencia

Proyecto académico — UABC. Uso educativo.
