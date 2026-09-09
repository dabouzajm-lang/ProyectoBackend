# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js y Express** para gestionar servicios y reservas.

El proyecto utiliza archivos JSON como sistema de persistencia y está organizado mediante una **arquitectura en capas**, separando las responsabilidades entre routers, controllers, services, repositories y DAO.

Esta organización permite desacoplar la lógica de negocio del acceso a datos y prepara el proyecto para futuras implementaciones con otras tecnologías de persistencia, como MongoDB y Mongoose.

Las operaciones sobre archivos se realizan de forma asíncrona utilizando `fs/promises` y `async/await`, evitando bloquear el event loop de Node.js.

---

# Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- ECMAScript Modules (ESM)
- FileSystem con Promises (`fs/promises`)
- Async/Await
- dotenv
- JSON

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/dabouzajm-lang/ProyectoBackend.git
```

## 2. Ingresar al proyecto

```bash
cd ProyectoBackend
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no se versiona en Git.

## 5. Iniciar el servidor

```bash
npm start
```

Si la configuración es correcta:

```text
Servidor ejecutándose en http://localhost:8080
```

La API quedará disponible en:

```text
http://localhost:8080
```

---

# Estructura del proyecto

```text
ProyectoBackend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   │
│   ├── services/
│   │   ├── services.service.js
│   │   └── bookings.service.js
│   │
│   ├── repositories/
│   │   ├── services.repository.js
│   │   └── bookings.repository.js
│   │
│   ├── dao/
│   │   ├── services.dao.js
│   │   └── bookings.dao.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   │
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
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

---

# Arquitectura en capas

La aplicación utiliza una arquitectura en capas para separar responsabilidades y reducir el acoplamiento entre la lógica HTTP, las reglas de negocio y la persistencia.

El flujo de una petición es:

```text
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Archivo JSON
```

Cada capa conoce únicamente las responsabilidades necesarias para realizar su trabajo.

## Router

Define los endpoints de la API y los conecta con las funciones correspondientes de los controllers.

Los routers no contienen lógica de negocio ni acceden directamente a los datos.

```text
src/routes/services.router.js
src/routes/bookings.router.js
```

Ejemplo:

```js
router.get("/", getServices);
router.get("/:sid", getServiceById);
router.post("/", createService);
```

## Controller

Recibe las peticiones HTTP provenientes de los routers.

Sus responsabilidades son:

- Leer `req.params`.
- Leer `req.query`.
- Leer `req.body`.
- Llamar al service correspondiente.
- Definir códigos de estado HTTP.
- Responder mediante `res.status().json()`.

```text
src/controllers/services.controller.js
src/controllers/bookings.controller.js
```

Los objetos `req` y `res` de Express se utilizan únicamente en esta capa.

## Service

Contiene las reglas y lógica de negocio de la aplicación.

```text
src/services/services.service.js
src/services/bookings.service.js
```

Entre sus responsabilidades se encuentran:

- Validar los datos necesarios para crear servicios y reservas.
- Aplicar filtros de servicios.
- Coordinar operaciones entre distintos recursos.
- Aplicar las reglas relacionadas con los servicios asociados a una reserva.

Los services no conocen `req` ni `res` y tampoco acceden directamente a archivos JSON.

## Repository

Funciona como una abstracción para el acceso a datos.

```text
src/repositories/services.repository.js
src/repositories/bookings.repository.js
```

Los repositories ofrecen métodos para consultar y modificar datos sin contener reglas de negocio.

Además, permiten desacoplar los services de la implementación concreta utilizada para persistir la información.

## DAO

DAO significa **Data Access Object**.

Esta capa es responsable del acceso directo al sistema de persistencia.

```text
src/dao/services.dao.js
src/dao/bookings.dao.js
```

En la implementación actual, los DAO leen y escriben directamente los archivos JSON mediante `fs/promises`.

Esta es la única capa que conoce la ubicación física de:

```text
src/data/services.json
src/data/bookings.json
```

Los DAO no contienen reglas de negocio.

---

# Persistencia con FileSystem

Actualmente la aplicación utiliza archivos JSON para almacenar los datos:

```text
src/data/services.json
src/data/bookings.json
```

Las operaciones se realizan utilizando la API de Promises de FileSystem:

```js
import { readFile, writeFile } from "fs/promises";
```

Ejemplo de lectura:

```js
const data = await readFile(
  filePath,
  "utf-8"
);
```

Ejemplo de escritura:

```js
await writeFile(
  filePath,
  JSON.stringify(data, null, 2),
  "utf-8"
);
```

Todas las operaciones se realizan mediante `async/await`.

Esto evita utilizar operaciones sincrónicas como `readFileSync` y `writeFileSync`, que podrían bloquear el event loop.

La responsabilidad de utilizar FileSystem se encuentra exclusivamente en los DAO.

---

# Recurso Services

Los servicios representan las prestaciones disponibles dentro del sistema.

Ejemplo:

```json
{
  "id": 1,
  "name": "Consulta inicial",
  "description": "Consulta general con un profesional.",
  "duration": 60,
  "price": 15000,
  "category": "Consulta",
  "available": true
}
```

El `id` se genera automáticamente.

## Flujo interno

```text
services.router.js
        ↓
services.controller.js
        ↓
services.service.js
        ↓
services.repository.js
        ↓
services.dao.js
        ↓
services.json
```

## Controller y Service

Exponen las siguientes operaciones:

```text
getServices
getServiceById
createService
updateService
deleteService
```

## Repository y DAO

Exponen:

```text
getAll
getById
create
update
delete
```

---

# Endpoints de Services

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/services` | Obtiene todos los servicios |
| `GET` | `/api/services/:sid` | Obtiene un servicio por ID |
| `POST` | `/api/services` | Crea un servicio |
| `PUT` | `/api/services/:sid` | Actualiza un servicio |
| `DELETE` | `/api/services/:sid` | Elimina un servicio |

## GET `/api/services`

Obtiene todos los servicios.

También permite filtrar por categoría:

```http
GET /api/services?category=Salud
```

Por disponibilidad:

```http
GET /api/services?available=true
```

O combinar ambos filtros:

```http
GET /api/services?category=Salud&available=true
```

## GET `/api/services/:sid`

Obtiene un servicio por ID.

```http
GET /api/services/1
```

Si no existe, devuelve:

```text
404 Not Found
```

## POST `/api/services`

Crea un servicio.

Ejemplo:

```json
{
  "name": "Kinesiología",
  "description": "Sesión de recuperación y movilidad.",
  "duration": 50,
  "price": 20000,
  "category": "Salud",
  "available": true
}
```

Campos requeridos:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

El `id` es generado automáticamente.

Si la creación es correcta:

```text
201 Created
```

## PUT `/api/services/:sid`

Actualiza un servicio.

Ejemplo:

```http
PUT /api/services/1
```

Body:

```json
{
  "price": 22000,
  "available": false
}
```

El `id` original del servicio se conserva.

## DELETE `/api/services/:sid`

Elimina un servicio.

```http
DELETE /api/services/1
```

---

# Recurso Bookings

Las reservas representan los turnos creados por los clientes.

Ejemplo:

```json
{
  "id": 1,
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-15",
  "time": "18:00",
  "status": "pending",
  "services": [
    {
      "service": 4,
      "quantity": 2
    }
  ]
}
```

## Flujo interno

```text
bookings.router.js
        ↓
bookings.controller.js
        ↓
bookings.service.js
        ↓
bookings.repository.js
        ↓
bookings.dao.js
        ↓
bookings.json
```

## Controller y Service

Exponen:

```text
createBooking
getBookingById
addServiceToBooking
```

## Repository y DAO

Exponen:

```text
create
getById
update
```

---

# Regla de negocio: servicios de una reserva

Una reserva puede contener distintos servicios.

Cada elemento del array `services` posee:

```json
{
  "service": 4,
  "quantity": 1
}
```

Cuando un servicio se agrega por primera vez, se incorpora con:

```text
quantity = 1
```

Si el mismo servicio se agrega nuevamente, no se genera un elemento duplicado.

En su lugar se incrementa:

```text
quantity += 1
```

Por ejemplo:

```json
{
  "service": 4,
  "quantity": 2
}
```

Esta regla de negocio se encuentra implementada en:

```text
src/services/bookings.service.js
```

El DAO no conoce esta regla. Solo recibe la información resultante y la persiste en `bookings.json`.

---

# Endpoints de Bookings

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/bookings` | Crea una reserva |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por ID |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

## POST `/api/bookings`

Crea una nueva reserva.

Ejemplo:

```json
{
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-15",
  "time": "18:00",
  "status": "pending",
  "services": []
}
```

Si se crea correctamente:

```text
201 Created
```

## GET `/api/bookings/:bid`

Obtiene una reserva por ID.

```http
GET /api/bookings/1
```

Si la reserva no existe:

```text
404 Not Found
```

## POST `/api/bookings/:bid/services/:sid`

Agrega un servicio a una reserva.

Ejemplo:

```http
POST /api/bookings/1/services/4
```

No requiere body.

El service comprueba la existencia de la reserva y del servicio antes de realizar la operación.

Si alguno de los recursos no existe, la API responde con:

```text
404 Not Found
```

---

# Códigos de estado HTTP

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos faltantes o inválidos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Pruebas de la API

La API puede probarse utilizando herramientas como Thunder Client o Postman.

Un flujo de prueba posible es:

1. Consultar servicios con `GET /api/services`.
2. Crear un servicio con `POST /api/services`.
3. Consultar el servicio creado.
4. Actualizar el servicio.
5. Crear una reserva.
6. Consultar la reserva.
7. Agregar un servicio a la reserva.
8. Agregar nuevamente el mismo servicio y comprobar el incremento de `quantity`.
9. Reiniciar el servidor.
10. Consultar nuevamente los datos para verificar su persistencia.

---

# Ventajas de la arquitectura

La arquitectura implementada permite separar claramente las responsabilidades de la aplicación:

```text
HTTP
 ↓
Router
 ↓
Controller
 ↓
Reglas de negocio
 ↓
Service
 ↓
Abstracción de datos
 ↓
Repository
 ↓
Persistencia
 ↓
DAO
 ↓
JSON
```

Gracias a esta separación, una futura migración hacia otro sistema de persistencia puede realizarse sin acoplar los controllers o las reglas de negocio a la implementación actual basada en archivos JSON.

---

# Exclusiones del repositorio

El archivo `.gitignore` evita versionar archivos que no deben formar parte de la entrega:

```text
node_modules/
.env
```

El archivo `.env.example` sí se incluye como referencia para configurar el proyecto.

El repositorio no incluye credenciales reales ni información sensible.