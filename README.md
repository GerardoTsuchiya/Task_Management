# Infuse — Task Management App

Infuse es una aplicación web para la gestión de tareas y proyectos. Permite a los usuarios crear proyectos, organizar tareas con prioridades y estados, asignar subtareas, etiquetar y recibir notificaciones — todo en un solo lugar. Desarrollada como proyecto académico para la Universidad Autónoma de Baja California (UABC).

---

## Equipo

| Nombre | Rol | Matrícula |
|--------|-----|-----------|
| Paulina Mendoza Quiroz | Diseño / Frontend | 372532 |
| Jennifer Salgado Pacheco | Frontend | 375100 |
| Gerardo Yepez Tsuchiya | Backend | 346176 |

---

## Arquitectura general

El proyecto sigue una arquitectura cliente-servidor. El frontend se comunica con el backend a través de una API REST protegida con JWT.

```
┌──────────────────────────────────────────────┐
│                   Cliente                     │
│          React 19 + Vite + TypeScript         │
│                                              │
│  Login · Registro · Dashboard · Proyectos    │
└────────────────────┬─────────────────────────┘
                     │ HTTP / REST (Bearer JWT)
                     │ localhost:3000
┌────────────────────▼─────────────────────────┐
│                  Servidor                     │
│     NestJS 11 + Prisma 7 + TypeScript         │
│                                              │
│  Auth · Proyectos · Tareas · Subtareas       │
│  Etiquetas · Notificaciones · Swagger        │
└────────────────────┬─────────────────────────┘
                     │
┌────────────────────▼─────────────────────────┐
│              Base de datos                    │
│           PostgreSQL (Supabase)               │
└──────────────────────────────────────────────┘
```

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 · TypeScript · Vite · Lucide React |
| Backend | NestJS 11 · TypeScript · Prisma 7 ORM |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT · Passport · Bcrypt |
| Validación | class-validator · class-transformer |
| Documentación API | Swagger (`/api/docs`) |

---

## Instalación y configuración

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- Acceso a una instancia de PostgreSQL (local o en la nube)

### Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Task_Management
```

### Levantar el backend

```bash
cd Backend
npm install
# Configurar .env (ver Backend/README.md)
npm run start:dev
```

### Levantar el frontend

```bash
cd Frontend
npm install
npm run dev
```

Consulta los README de cada carpeta para la configuración detallada:
- [Backend/README.md](./Backend/README.md)
- [Frontend/README.md](./Frontend/README.md)

---

## Estructura del proyecto

```
Task_Management/
├── Backend/    # API REST — NestJS + Prisma + PostgreSQL
├── Frontend/   # Aplicación cliente — React + Vite
└── README.md   # Este archivo
```

---

## Licencia

Proyecto académico — UABC. Uso educativo.
