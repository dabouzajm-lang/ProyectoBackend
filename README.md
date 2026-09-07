# Sistema Backend de Turnos y Reservas

Primera versión funcional de una API REST para gestionar **servicios** y **reservas**, desarrollada con Node.js, Express y FileSystem.

El proyecto utiliza archivos JSON como sistema de persistencia, por lo que los servicios y las reservas creadas o modificadas se conservan después de reiniciar el servidor.

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

## Estructura del proyecto

```text
ProyectoBackend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Persistencia con FileSystem

Los datos de la aplicación se almacenan en archivos JSON utilizando la API de Promises de FileSystem (`fs/promises`) de Node.js.

Los servicios se almacenan en:

```text
src/data/services.json
```

Las reservas se almacenan en:

```text
src/data/bookings.json
```

Las operaciones de lectura y escritura se realizan de forma asíncrona mediante `readFile` y `writeFile` junto con `async/await`.

De esta manera, las operaciones sobre archivos no utilizan métodos sincrónicos como `readFileSync` o `writeFileSync`, evitando bloquear el event loop mientras el servidor espera la finalización de las operaciones de entrada/salida.

Las operaciones que modifican los datos actualizan los archivos JSON correspondientes, por lo que la información persiste aunque el servidor sea detenido y posteriormente reiniciado.

---

# Recurso `services`

Los servicios representan las prestaciones disponibles para reservar.

Cada servicio posee la siguiente estructura:

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

### GET `/api/services/:sid`

Obtiene un servicio según su ID.

Ejemplo:

```http
GET /api/services/1
```

Si existe, devuelve:

```text
200 OK
```

Si no existe, devuelve:

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

Los datos son validados antes de crear el servicio.

Las principales validaciones contemplan:

- `name`, `description` y `category` deben ser textos.
- `duration` debe ser un número mayor a `0`.
- `price` debe ser un número mayor o igual a `0`.
- `available` debe ser un valor booleano (`true` o `false`).

Si la creación es correcta, devuelve:

```text
201 Created
```

Si los datos enviados no son válidos o faltan campos requeridos:

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

Si el servicio existe, devuelve:

```text
200 OK
```

Si no existe, devuelve:

```text
404 Not Found
```

### DELETE `/api/services/:sid`

Elimina un servicio existente.

Ejemplo:

```http
DELETE /api/services/1
```

Si el servicio existe, devuelve:

```text
200 OK
```

Si no existe, devuelve:

```text
404 Not Found
```

---

# Recurso `bookings`

Las reservas representan los turnos creados por los clientes.

Cada reserva posee la siguiente estructura:

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

Si la reserva se crea correctamente, devuelve:

```text
201 Created
```

Si faltan campos requeridos, devuelve:

```text
400 Bad Request
```

### GET `/api/bookings/:bid`

Obtiene una reserva por su ID.

Ejemplo:

```http
GET /api/bookings/1
```

Si la reserva existe, devuelve:

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

Antes de agregar el servicio se valida que existan tanto la reserva como el servicio.

La primera vez que se agrega un servicio se almacena:

```json
{
  "service": 4,
  "quantity": 1
}
```

Si se vuelve a agregar el mismo servicio a la reserva, no se crea un elemento duplicado. En su lugar, se incrementa `quantity`:

```json
{
  "service": 4,
  "quantity": 2
}
```

Si la reserva no existe, devuelve:

```text
404 Not Found
```

Si el servicio no existe, también devuelve:

```text
404 Not Found
```

---

# Managers

## `ServiceManager`

`ServiceManager` administra el recurso `services` y su persistencia en `services.json`.

Implementa los métodos:

- `getServices`
- `getServiceById`
- `addService`
- `updateService`
- `deleteService`

Las operaciones de lectura y escritura se realizan de forma asíncrona mediante `readFile` y `writeFile` de `fs/promises`.

Los métodos del manager utilizan `async/await` para gestionar las operaciones de FileSystem sin bloquear el event loop de Node.js.

Cada operación trabaja con los datos almacenados en `services.json`, manteniendo el archivo como fuente de persistencia de los servicios.

## `BookingManager`

`BookingManager` administra el recurso `bookings` y su persistencia en `bookings.json`.

Implementa los métodos:

- `createBooking`
- `getBookingById`
- `addServiceToBooking`

Al agregar un servicio a una reserva, si el servicio ya se encuentra asociado, se incrementa su propiedad `quantity`.

Las reservas son leídas y almacenadas de forma asíncrona en `bookings.json` mediante `fs/promises` y `async/await`.

---

# Códigos de estado HTTP

La API utiliza los siguientes códigos principales:

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos faltantes o inválidos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Manejo asíncrono de archivos

La persistencia utiliza la API basada en Promises de FileSystem:

```js
import { readFile, writeFile } from "fs/promises";
```

Las operaciones de entrada/salida se realizan utilizando `async/await`.

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

Este enfoque permite que Node.js continúe atendiendo otras tareas mientras espera que finalicen las operaciones de entrada/salida, en lugar de bloquear el event loop mediante operaciones sincrónicas como `readFileSync` y `writeFileSync`.

---

# Pruebas de la API

Los endpoints pueden probarse utilizando herramientas como **Thunder Client** o Postman.

Ejemplo de flujo de prueba:

1. Crear un servicio con `POST /api/services`.
2. Crear una reserva con `POST /api/bookings`.
3. Consultar la reserva con `GET /api/bookings/:bid`.
4. Agregar el servicio mediante `POST /api/bookings/:bid/services/:sid`.
5. Volver a agregar el mismo servicio para comprobar el incremento de `quantity`.
6. Reiniciar el servidor.
7. Consultar nuevamente los recursos para comprobar que los datos continúan almacenados en los archivos JSON.

## Exclusiones del repositorio

El proyecto utiliza `.gitignore` para evitar versionar archivos que no deben formar parte de la entrega, incluyendo:

```text
node_modules/
.env
```

El archivo `.env.example` sí se incluye como referencia para configurar las variables de entorno necesarias.