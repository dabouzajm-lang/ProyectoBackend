# Sistema Backend de Turnos y Reservas

API REST para gestionar **servicios** y **reservas**, desarrollada con Node.js, Express y FileSystem.

El proyecto utiliza archivos JSON como sistema de persistencia, por lo que los servicios y las reservas creadas o modificadas se conservan después de reiniciar el servidor.

La API está organizada mediante una arquitectura por capas que separa las responsabilidades entre **routers, controllers y managers**, facilitando el mantenimiento y crecimiento del proyecto.

Las operaciones de lectura y escritura de archivos se realizan de forma asíncrona utilizando la API de Promises de FileSystem (`fs/promises`) junto con `async/await`, evitando operaciones sincrónicas que puedan bloquear el event loop de Node.js.

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- ECMAScript Modules (ESM)
- FileSystem con Promises (`fs/promises`)
- Async/Await
- dotenv
- JSON

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/dabouzajm-lang/ProyectoBackend.git
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd ProyectoBackend
```

### 3. Instalar las dependencias

```bash
npm install
```

Esto instalará las dependencias declaradas en `package.json`, incluyendo Express y dotenv.

### 4. Configurar las variables de entorno

En la raíz del proyecto se incluye un archivo `.env.example`.

Crear un archivo `.env` tomando como referencia ese archivo:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no se encuentra versionado en Git por contener configuración local.

### 5. Iniciar el servidor

```bash
npm start
```

Si la configuración es correcta, la consola mostrará:

```text
Servidor ejecutándose en http://localhost:8080
```

La API quedará disponible en:

```text
http://localhost:8080
```

---

## Estructura del proyecto

```text
ProyectoBackend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Arquitectura de la API

La aplicación está organizada en diferentes capas para mantener una clara separación de responsabilidades.

El flujo general de una petición es:

```text
Cliente
   ↓
Router
   ↓
Controller
   ↓
Manager
   ↓
Archivo JSON
```

La respuesta realiza el camino inverso:

```text
Archivo JSON
   ↓
Manager
   ↓
Controller
   ↓
Cliente
```

## Routers

Los routers se encargan exclusivamente de definir los endpoints de la API y conectarlos con las funciones correspondientes de los controllers.

No contienen lógica de negocio, acceso a archivos JSON ni manejo directo de los datos.

Los routers disponibles son:

```text
src/routes/services.router.js
src/routes/bookings.router.js
```

Ejemplo conceptual:

```js
router.get("/", getServices);
router.get("/:sid", getServiceById);
router.post("/", createService);
```

## Controllers

Los controllers funcionan como intermediarios entre las rutas y los managers.

Sus responsabilidades incluyen:

- Leer información proveniente de `req.params`.
- Leer filtros desde `req.query`.
- Leer datos enviados mediante `req.body`.
- Llamar al manager correspondiente.
- Manejar los códigos de estado HTTP.
- Enviar las respuestas mediante `res.status().json()`.

Los controllers disponibles son:

```text
src/controllers/services.controller.js
src/controllers/bookings.controller.js
```

## Managers

Los managers contienen la lógica relacionada con los datos y la persistencia.

Sus responsabilidades incluyen:

- Leer los archivos JSON.
- Buscar recursos.
- Crear recursos.
- Actualizar recursos.
- Eliminar recursos cuando corresponda.
- Persistir los cambios mediante FileSystem.

Los managers no utilizan objetos de Express como `req` o `res`.

Los managers disponibles son:

```text
src/managers/ServiceManager.js
src/managers/BookingManager.js
```

## Data

Los datos son almacenados de forma persistente en:

```text
src/data/services.json
src/data/bookings.json
```

Estos archivos funcionan como sistema de persistencia de la aplicación en esta etapa del proyecto.

---

# Persistencia con FileSystem

Los datos de la aplicación se almacenan en archivos JSON utilizando la API de Promises de FileSystem (`fs/promises`) de Node.js.

Las operaciones de lectura y escritura se realizan de forma asíncrona mediante `readFile` y `writeFile` junto con `async/await`.

La persistencia utiliza:

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

Este enfoque evita utilizar métodos sincrónicos como `readFileSync` y `writeFileSync`, que podrían bloquear el event loop mientras Node.js espera la finalización de una operación de entrada/salida.

Los cambios realizados sobre servicios y reservas son almacenados en los archivos JSON correspondientes, por lo que la información persiste después de detener y reiniciar el servidor.

---

# Recurso `services`

Los servicios representan las prestaciones disponibles para reservar.

Cada servicio posee una estructura similar a:

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

El campo `id` es generado automáticamente por `ServiceManager` y no debe enviarse en el body al crear un servicio.

## Endpoints de servicios

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/services` | Obtiene todos los servicios |
| `GET` | `/api/services/:sid` | Obtiene un servicio por ID |
| `POST` | `/api/services` | Crea un nuevo servicio |
| `PUT` | `/api/services/:sid` | Actualiza un servicio |
| `DELETE` | `/api/services/:sid` | Elimina un servicio |

### GET `/api/services`

Obtiene todos los servicios.

```http
GET /api/services
```

Permite filtrar por categoría:

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

### GET `/api/services/:sid`

Obtiene un servicio según su ID.

Ejemplo:

```http
GET /api/services/1
```

Si existe:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

### POST `/api/services`

Crea un nuevo servicio.

Ejemplo de body:

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

No debe enviarse el campo `id`, ya que se genera automáticamente.

Los campos requeridos son:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

Las principales validaciones contemplan:

- `name`, `description` y `category` deben ser textos.
- `duration` debe ser un número mayor a `0`.
- `price` debe ser un número mayor o igual a `0`.
- `available` debe ser un valor booleano (`true` o `false`).

Si la creación es correcta:

```text
201 Created
```

Si los datos son inválidos o faltan campos:

```text
400 Bad Request
```

### PUT `/api/services/:sid`

Actualiza un servicio existente.

Ejemplo:

```http
PUT /api/services/1
```

Body:

```json
{
  "price": 18000,
  "available": false
}
```

El `id` del servicio no puede modificarse.

Si existe:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

### DELETE `/api/services/:sid`

Elimina un servicio existente.

Ejemplo:

```http
DELETE /api/services/1
```

Si existe:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

---

# Recurso `bookings`

Las reservas representan los turnos creados por los clientes.

Cada reserva posee una estructura similar a:

```json
{
  "id": 1,
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "15:30",
  "status": "pending",
  "services": [
    {
      "service": 4,
      "quantity": 2
    }
  ]
}
```

El campo `id` se genera automáticamente.

El array `services` almacena los servicios asociados a la reserva mediante el ID del servicio y su cantidad.

## Endpoints de reservas

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/bookings` | Crea una nueva reserva |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por ID |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

### POST `/api/bookings`

Crea una nueva reserva.

Ejemplo:

```http
POST /api/bookings
```

Body:

```json
{
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "15:30",
  "status": "pending",
  "services": []
}
```

Una reserva puede iniciarse con el array `services` vacío.

El `id` se genera automáticamente.

Si se crea correctamente:

```text
201 Created
```

Si faltan campos requeridos:

```text
400 Bad Request
```

### GET `/api/bookings/:bid`

Obtiene una reserva por su ID.

Ejemplo:

```http
GET /api/bookings/1
```

Si existe:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

### POST `/api/bookings/:bid/services/:sid`

Agrega un servicio existente a una reserva existente.

Ejemplo:

```http
POST /api/bookings/1/services/4
```

Donde:

- `1` corresponde al ID de la reserva (`bid`).
- `4` corresponde al ID del servicio (`sid`).

No requiere body.

El controller valida que la reserva exista mediante `BookingManager` y que el servicio exista mediante `ServiceManager`.

La primera vez que se agrega un servicio:

```json
{
  "service": 4,
  "quantity": 1
}
```

Si se vuelve a agregar el mismo servicio, no se crea un elemento duplicado. Se incrementa `quantity`:

```json
{
  "service": 4,
  "quantity": 2
}
```

Si la reserva no existe:

```text
404 Not Found
```

Si el servicio no existe:

```text
404 Not Found
```

---

# Controllers

## `services.controller.js`

El controller de servicios interactúa con `ServiceManager` e implementa:

- `getServices`
- `getServiceById`
- `createService`
- `updateService`
- `deleteService`

Estas funciones reciben las requests provenientes de `services.router.js`, llaman a `ServiceManager` y generan las responses correspondientes.

## `bookings.controller.js`

El controller de reservas interactúa principalmente con `BookingManager` e implementa:

- `createBooking`
- `getBookingById`
- `addServiceToBooking`

En `addServiceToBooking`, el controller también utiliza `ServiceManager` para comprobar que el servicio indicado por `sid` exista antes de incorporarlo a la reserva.

---

# Managers

## `ServiceManager`

`ServiceManager` administra la lógica de datos del recurso `services`.

Implementa:

- `getServices`
- `getServiceById`
- `addService`
- `updateService`
- `deleteService`

Las operaciones de lectura y escritura se realizan de forma asíncrona sobre `services.json` mediante `fs/promises`.

## `BookingManager`

`BookingManager` administra la lógica de datos del recurso `bookings`.

Implementa:

- `createBooking`
- `getBookingById`
- `addServiceToBooking`

Al agregar un servicio a una reserva, si ese servicio ya se encuentra asociado, se incrementa su propiedad `quantity`.

Las operaciones son persistidas de forma asíncrona en `bookings.json`.

---

# Códigos de estado HTTP

La API utiliza principalmente los siguientes códigos:

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos faltantes o inválidos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Pruebas de la API

Los endpoints pueden probarse utilizando herramientas como **Thunder Client** o Postman.

Un flujo de prueba posible es:

1. Obtener los servicios mediante `GET /api/services`.
2. Crear un servicio mediante `POST /api/services`.
3. Consultarlo mediante `GET /api/services/:sid`.
4. Actualizarlo mediante `PUT /api/services/:sid`.
5. Crear una reserva mediante `POST /api/bookings`.
6. Consultarla mediante `GET /api/bookings/:bid`.
7. Agregar un servicio mediante `POST /api/bookings/:bid/services/:sid`.
8. Repetir la operación para comprobar el incremento de `quantity`.
9. Reiniciar el servidor.
10. Consultar nuevamente los recursos para comprobar la persistencia de los datos.

---

# Exclusiones del repositorio

El proyecto utiliza `.gitignore` para evitar versionar archivos que no deben formar parte de la entrega, incluyendo:

```text
node_modules/
.env
```

El archivo `.env.example` sí se incluye como referencia para configurar las variables de entorno necesarias.

No se incluyen credenciales reales ni información sensible en el repositorio.