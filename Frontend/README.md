# Infuse — Frontend

Aplicación cliente del proyecto Infuse, construida con [React 19](https://react.dev/) y [Vite](https://vitejs.dev/). Proporciona la interfaz de usuario para registro e inicio de sesión, gestión de proyectos y tareas, y visualización de estadísticas.

---

## Tecnologías

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| React | ^19 | Framework de UI |
| TypeScript | ^6 | Lenguaje |
| Vite | ^8 | Bundler y servidor de desarrollo |
| Lucide React | ^1.16 | Iconografía |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- El backend corriendo en `http://localhost:3000` (ver [Backend/README.md](../Backend/README.md))

---

## Instalación

```bash
cd Frontend
npm install
```

---

## Comandos disponibles

```bash
# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Compilar para producción
npm run build

# Vista previa del build de producción
npm run preview

# Linting
npm run lint
```

---

## Conexión con el backend

El frontend se conecta a la API en `http://localhost:3000` por defecto. Si el backend corre en otro puerto, actualiza la variable `BASE_URL` en `src/services/api.ts`.

La autenticación se maneja con tokens JWT almacenados en `localStorage`. Todas las peticiones autenticadas incluyen el header `Authorization: Bearer <token>`.

---

## Páginas y funcionalidades

| Página | Ruta lógica | Descripción |
|--------|-------------|-------------|
| Login | `/login` | Inicio de sesión con email y contraseña |
| Registro | `/register` | Creación de cuenta nueva |
| Dashboard | `/dashboard` | Panel principal con proyectos y tareas |

### Dashboard

- Barra lateral con lista de proyectos
- Creación, edición y eliminación de proyectos
- Invitación de miembros a proyectos
- Creación, edición, eliminación y visualización de tareas
- Filtrado de tareas por estado y prioridad
- Subtareas dentro de cada tarea
- Gráficas de progreso del proyecto
- Notificaciones

---

## Estructura del proyecto

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── Login/          # Página de inicio de sesión
│   │   ├── Register/       # Página de registro
│   │   └── Dashboard/      # Panel principal y todos sus modales
│   ├── components/         # Componentes reutilizables (Input, Navbar, etc.)
│   ├── services/
│   │   └── api.ts          # Cliente HTTP (fetch wrapper con JWT)
│   ├── constants/
│   │   └── colors.ts       # Paleta de colores del proyecto
│   ├── App.tsx             # Componente raíz y manejo de navegación
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── index.html
├── vite.config.js
└── package.json
```

---

## Licencia

Proyecto académico — UABC. Uso educativo.
