# Service Manager

## Descripción

Service Manager es un proyecto desarrollado con Node.js y ECMAScript Modules (ESM) que permite gestionar los servicios disponibles en un sistema de turnos y reservas.

El proyecto implementa una clase `ServiceManager` encargada de administrar los servicios mediante operaciones de consulta, creación, actualización y eliminación.

Los servicios se almacenan inicialmente en un archivo JSON.

---

## Tecnologías utilizadas

- Node.js
- JavaScript
- ECMAScript Modules (ESM)
- dotenv
- JSON

---

## Estructura del proyecto

```text
service-manager/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── data/
│   │   └── services.json
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md