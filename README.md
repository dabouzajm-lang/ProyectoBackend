# ⚙️ Service Manager API

API REST desarrollada con **Node.js, Express y ECMAScript Modules (ESM)** para gestionar el recurso `services` dentro de un **Sistema Backend de Turnos y Reservas**.

El proyecto implementa operaciones CRUD, filtros mediante query parameters, manejo de códigos de estado HTTP y una estructura modular que separa las rutas, la lógica de gestión, la configuración y la persistencia de datos.

---

## 📖 Sobre el proyecto

**Service Manager API** es una primera implementación de una API REST para administrar servicios dentro de un sistema de turnos y reservas.

El proyecto permite trabajar con diferentes partes de una petición HTTP utilizando Express:

- `req.params` para identificar servicios mediante su `sid`.
- `req.query` para filtrar servicios por categoría o disponibilidad.
- `req.body` para crear y actualizar servicios.

La lógica relacionada con los servicios se encuentra centralizada en `ServiceManager`, manteniéndola separada de la configuración de Express y de las rutas HTTP.

---

## ✨ Funcionalidades

La API permite:

- Obtener todos los servicios.
- Filtrar servicios por categoría.
- Filtrar servicios por disponibilidad.
- Buscar un servicio por ID.
- Crear nuevos servicios.
- Generar automáticamente el ID de un nuevo servicio.
- Actualizar servicios existentes.
- Mantener el ID original durante una actualización.
- Eliminar servicios.
- Manejar respuestas HTTP `200`, `201`, `400` y `404`.

---

## 🛠️ Tecnologías utilizadas

- Node.js
- JavaScript
- Express 5
- ECMAScript Modules (ESM)
- dotenv
- REST API
- JSON para persistencia local
- Git
- GitHub

---

## 📂 Estructura del proyecto

```text
ProyectoBackend/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── data/
│   │   └── services.json
│   │
│   ├── managers/
│   │   └── ServiceManager.js
│   │
│   ├── routes/
│   │   └── services.router.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidades principales

**`server.js`**  
Punto de entrada de la aplicación. Inicia el servidor utilizando el puerto configurado mediante variables de entorno.

**`app.js`**  
Configura la aplicación de Express, los middlewares y las rutas de la API.

**`routes/services.router.js`**  
Define los endpoints HTTP relacionados con el recurso `services`.

**`managers/ServiceManager.js`**  
Centraliza la lógica necesaria para consultar, crear, actualizar y eliminar servicios.

**`config/env.config.js`**  
Gestiona la configuración del entorno utilizando `dotenv`.

**`data/services.json`**  
Archivo utilizado como persistencia local de los servicios.

---

## 🔗 Endpoints

La ruta base del recurso es:

```text
/api/services
```

| Método | Endpoint | Descripción | Respuestas |
|---|---|---|---|
| `GET` | `/api/services` | Obtiene todos los servicios y permite aplicar filtros | `200` |
| `GET` | `/api/services/:sid` | Obtiene un servicio por ID | `200` / `404` |
| `POST` | `/api/services` | Crea un nuevo servicio y genera su ID automáticamente | `201` / `400` |
| `PUT` | `/api/services/:sid` | Actualiza un servicio existente sin modificar su ID | `200` / `404` |
| `DELETE` | `/api/services/:sid` | Elimina un servicio | `200` / `404` |

---

## 🔍 Filtros

El endpoint:

```http
GET /api/services
```

acepta filtros mediante query parameters.

### Filtrar por categoría

```http
GET /api/services?category=salud
```

### Filtrar por disponibilidad

```http
GET /api/services?available=true
```

### Combinar filtros

```http
GET /api/services?category=salud&available=true
```

Los parámetros se obtienen desde `req.query` y son enviados a `ServiceManager` para realizar el filtrado correspondiente.

---

## 📥 Obtener un servicio por ID

```http
GET /api/services/:sid
```

El identificador se obtiene mediante `req.params`.

Ejemplo:

```http
GET /api/services/1
```

Si el servicio existe, la API responde con:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

---

## ➕ Crear un servicio

```http
POST /api/services
```

Los datos del nuevo servicio se reciben mediante `req.body`.

El ID **no debe enviarse en el body**, ya que es generado internamente por `ServiceManager`.

Si el servicio se crea correctamente:

```text
201 Created
```

Si los datos enviados no son válidos o faltan campos requeridos:

```text
400 Bad Request
```

---

## ✏️ Actualizar un servicio

```http
PUT /api/services/:sid
```

El ID del servicio se obtiene mediante `req.params` y los datos a actualizar mediante `req.body`.

El ID original del servicio no puede modificarse durante la actualización.

Si el servicio existe:

```text
200 OK
```

Si no se encuentra:

```text
404 Not Found
```

---

## 🗑️ Eliminar un servicio

```http
DELETE /api/services/:sid
```

El identificador del servicio se obtiene mediante `req.params`.

Si el servicio existe y se elimina correctamente:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

---

## 🌐 Manejo de peticiones HTTP

La API utiliza las distintas herramientas proporcionadas por Express según el tipo de información recibida:

| Propiedad | Uso |
|---|---|
| `req.params` | Obtener el `sid` desde rutas dinámicas |
| `req.query` | Obtener filtros como `category` y `available` |
| `req.body` | Recibir datos en operaciones `POST` y `PUT` |

Esto permite separar correctamente los diferentes tipos de información enviados por el cliente.

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/dabouzajm-lang/ProyectoBackend.git
```

### 2. Ingresar al proyecto

```bash
cd ProyectoBackend
```

### 3. Instalar las dependencias

```bash
npm install
```

---

## 🔐 Variables de entorno

El proyecto utiliza `dotenv` para gestionar la configuración del entorno.

Se incluye un archivo `.env.example` como referencia.

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` está excluido del repositorio mediante `.gitignore` para evitar publicar configuración local o información sensible.

---

## ▶️ Ejecutar el servidor

Iniciar la aplicación con:

```bash
npm start
```

El script configurado en `package.json` ejecuta:

```bash
node src/server.js
```

Utilizando la configuración de ejemplo, el servidor estará disponible en:

```text
http://localhost:8080
```

Y el recurso `services` en:

```text
http://localhost:8080/api/services
```

---

## 🧩 Arquitectura

El proyecto utiliza una estructura modular sencilla, separando las principales responsabilidades:

- **Routes:** definición y manejo de endpoints HTTP.
- **Manager:** lógica relacionada con la gestión de servicios.
- **Config:** configuración y variables de entorno.
- **Data:** persistencia local mediante JSON.
- **App:** configuración de Express y registro de rutas.
- **Server:** inicialización del servidor.

Esta separación evita colocar la lógica de gestión directamente en `app.js` y facilita el mantenimiento y la evolución del proyecto.

---

## 🎯 Objetivo del proyecto

Este proyecto fue desarrollado como parte de mi formación en **Backend con Node.js**, con el objetivo de construir una primera API REST y aplicar conceptos fundamentales como:

- Diseño de endpoints REST.
- Métodos HTTP.
- Express y `express.Router()`.
- Parámetros dinámicos.
- Query parameters.
- Request body.
- Códigos de estado HTTP.
- Variables de entorno.
- ECMAScript Modules.
- Persistencia local.
- Separación de responsabilidades.
- Organización modular del código.

---

## 🚀 Posibles mejoras futuras

Como evolución del proyecto se podrían incorporar:

- Persistencia mediante una base de datos.
- Validaciones más avanzadas.
- Manejo centralizado de errores.
- Autenticación y autorización.
- Nuevos recursos relacionados con turnos y reservas.
- Tests automatizados.
- Documentación de la API con OpenAPI / Swagger.

Estas funcionalidades no forman parte de la implementación actual y se plantean únicamente como posibles extensiones.

---

## 👨‍💻 Autor

**Juan Manuel da Bouza**  
Frontend Developer ampliando formación en Backend con Node.js

🌐 **Portfolio**  
https://dabouzajm-lang.github.io/portfolio-daBouza/

💻 **GitHub**  
https://github.com/dabouzajm-lang

🔗 **LinkedIn**  
https://www.linkedin.com/in/juan-manuel-da-bouza-58a952249/

---

## 📄 Contexto académico

Proyecto desarrollado como parte de la formación **Backend I de CoderHouse**, aplicando los conceptos de diseño de endpoints REST y gestión del recurso `services`.