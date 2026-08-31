# Service Manager API

## Descripción

**Service Manager API** es una API REST desarrollada con **Node.js**, **Express** y **ECMAScript Modules (ESM)** para gestionar el recurso `services` dentro de un sistema de turnos y reservas.

El proyecto conecta las rutas HTTP con la clase `ServiceManager`, que concentra la lógica relacionada con la gestión de servicios.

La API permite:

- Obtener todos los servicios
- Filtrar servicios por categoría o disponibilidad
- Buscar un servicio por id
- Crear nuevos servicios
- Actualizar servicios existentes
- Eliminar servicios

---

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- ECMAScript Modules (ESM)
- dotenv
- JSON

---

## Estructura del proyecto

```text
ProyectoBackend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── data/
│   │   └── services.json
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── routes/
│   │   └── services.router.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md