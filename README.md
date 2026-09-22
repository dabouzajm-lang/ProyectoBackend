# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para gestionar servicios y reservas.

El proyecto utiliza **MongoDB Atlas** como sistema de persistencia y está organizado mediante una arquitectura en capas que separa las responsabilidades entre routers, controllers, services, repositories y DAO.

Esta versión representa la migración de la persistencia original basada en FileSystem y archivos JSON hacia MongoDB, manteniendo los mismos endpoints y el comportamiento externo de la API.

---

# Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- ECMAScript Modules (ESM)
- MongoDB Atlas
- Mongoose
- dotenv
- Async/Await

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

Esto instalará las dependencias declaradas en `package.json`, incluyendo Express, dotenv y Mongoose.

---

# Configuración de variables de entorno

El proyecto utiliza variables de entorno para almacenar la configuración de la aplicación y la conexión con MongoDB Atlas.

En la raíz del proyecto se incluye:

```text
.env.example
```

Crear un archivo `.env` tomando ese archivo como referencia.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
```

La URI mostrada es únicamente un ejemplo.

La URI real de MongoDB Atlas debe configurarse exclusivamente en el archivo `.env` local.

El archivo `.env` no se versiona y se encuentra excluido mediante `.gitignore`.

---

# Iniciar el servidor

Ejecutar:

```bash
npm start
```

La aplicación primero intenta establecer la conexión con MongoDB.

Si la conexión es correcta:

```text
Conexión a MongoDB establecida correctamente.
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
│   │   ├── db.config.js
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
│   ├── models/
│   │   ├── service.model.js
│   │   ├── booking.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
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

La aplicación mantiene una arquitectura en capas para separar las responsabilidades HTTP, la lógica de negocio y el acceso a datos.

El flujo general es:

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
Mongoose
   ↓
MongoDB Atlas
```

La migración a MongoDB se realizó principalmente sobre la capa de persistencia, evitando acoplar los controllers y las reglas de negocio a una tecnología específica de almacenamiento.

---

## Router

Los routers definen los endpoints de la API y los conectan con los controllers correspondientes.

```text
src/routes/services.router.js
src/routes/bookings.router.js
```

No contienen reglas de negocio ni realizan consultas directas a MongoDB.

---

## Controller

Los controllers reciben las peticiones HTTP.

Sus responsabilidades son:

- Leer `req.params`.
- Leer `req.query`.
- Leer `req.body`.
- Llamar al service correspondiente.
- Determinar los códigos de estado HTTP.
- Enviar las respuestas mediante `res.status().json()`.

```text
src/controllers/services.controller.js
src/controllers/bookings.controller.js
```

Los objetos `req` y `res` de Express se utilizan exclusivamente en esta capa.

---

## Service

Los services contienen las reglas de negocio de la aplicación.

```text
src/services/services.service.js
src/services/bookings.service.js
```

Entre sus responsabilidades se encuentran:

- Validar los datos necesarios para crear servicios y reservas.
- Aplicar filtros sobre servicios.
- Coordinar operaciones entre distintos recursos.
- Gestionar la incorporación de servicios a una reserva.
- Incrementar `quantity` cuando un mismo servicio se agrega más de una vez.

Los services no acceden directamente a MongoDB y no utilizan `req` ni `res`.

---

## Repository

Los repositories proporcionan una abstracción para el acceso a los datos.

```text
src/repositories/services.repository.js
src/repositories/bookings.repository.js
```

Sus métodos son utilizados por la capa de services sin necesidad de conocer cómo se persisten internamente los datos.

Los repositories no contienen reglas de negocio.

---

## DAO

DAO significa **Data Access Object**.

Los DAO son responsables de realizar las operaciones de persistencia utilizando los modelos de Mongoose.

```text
src/dao/services.dao.js
src/dao/bookings.dao.js
```

Entre las operaciones utilizadas se encuentran:

```js
Model.find();
Model.findById();
Model.create();
Model.findByIdAndUpdate();
Model.findByIdAndDelete();
```

Los DAO no contienen reglas de negocio.

También verifican el formato de los identificadores antes de realizar consultas que requieren un `ObjectId`, permitiendo mantener respuestas HTTP coherentes ante IDs inválidos.

---

# Conexión con MongoDB

La conexión con MongoDB se encuentra centralizada en:

```text
src/config/db.config.js
```

La aplicación obtiene la URI mediante:

```text
MONGO_URI
```

definida en las variables de entorno.

Conceptualmente:

```js
await mongoose.connect(config.mongoUri);
```

El servidor HTTP se inicia después de establecer correctamente la conexión con MongoDB.

La URI real de conexión nunca se almacena directamente en el código fuente.

---

# Modelos de Mongoose

La aplicación define tres modelos separados:

```text
src/models/service.model.js
src/models/booking.model.js
src/models/message.model.js
```

---

## Service Model

Representa los servicios disponibles dentro del sistema.

Sus principales campos son:

```text
name
description
duration
price
category
available
```

Ejemplo de un servicio:

```json
{
  "_id": "ObjectId generado por MongoDB",
  "name": "Kinesiología",
  "description": "Sesión de recuperación y movilidad.",
  "duration": 50,
  "price": 20000,
  "category": "Salud",
  "available": true
}
```

MongoDB genera automáticamente el identificador `_id` de cada documento.

---

## Booking Model

Representa las reservas realizadas por los clientes.

Sus principales campos son:

```text
clientName
clientEmail
date
time
status
services
```

Ejemplo conceptual:

```json
{
  "_id": "ObjectId generado por MongoDB",
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-25",
  "time": "18:00",
  "status": "pending",
  "services": [
    {
      "service": "ObjectId del servicio",
      "quantity": 2
    }
  ]
}
```

---

# Referencias entre Booking y Service

Los servicios asociados a una reserva no se almacenan como objetos completos.

Cada elemento del array `services` posee la estructura:

```text
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` está definido en Mongoose mediante:

```js
service: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Service",
  required: true
}
```

De esta forma, cada reserva mantiene una referencia al documento correspondiente de la colección de servicios.

Esto evita duplicar toda la información de un servicio dentro de cada reserva.

---

# Regla de negocio de quantity

Cuando un servicio se agrega por primera vez a una reserva, se incorpora con:

```text
quantity = 1
```

Si el mismo servicio se agrega nuevamente, no se crea una segunda referencia.

En su lugar:

```text
quantity += 1
```

Por ejemplo:

```json
{
  "service": "ObjectId del servicio",
  "quantity": 2
}
```

Esta regla está implementada en:

```text
src/services/bookings.service.js
```

No se encuentra en el DAO ni en el modelo de Mongoose, ya que corresponde a una regla de negocio.

---

## Message Model

El proyecto también incluye el modelo:

```text
src/models/message.model.js
```

Este modelo prepara el recurso `messages` solicitado para esta etapa del proyecto.

Actualmente no se agregaron endpoints nuevos para mensajes, ya que la actividad mantiene los endpoints previamente definidos para servicios y reservas.

---

# Recurso Services

El flujo de una operación de servicios es:

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
ServiceModel
        ↓
MongoDB Atlas
```

Controller y Service exponen:

```text
getServices
getServiceById
createService
updateService
deleteService
```

Repository y DAO exponen:

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

Obtiene todos los servicios almacenados en MongoDB.

Permite filtrar por categoría:

```http
GET /api/services?category=Salud
```

Por disponibilidad:

```http
GET /api/services?available=true
```

O combinar ambos:

```http
GET /api/services?category=Salud&available=true
```

---

## GET `/api/services/:sid`

Obtiene un servicio mediante su `_id`.

```http
GET /api/services/68abc123...
```

Si el servicio no existe o el identificador no posee un formato válido:

```text
404 Not Found
```

---

## POST `/api/services`

Crea un nuevo servicio.

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

Si la creación es correcta:

```text
201 Created
```

MongoDB genera automáticamente el campo `_id`.

---

## PUT `/api/services/:sid`

Actualiza un servicio existente.

Ejemplo:

```json
{
  "price": 22000,
  "available": false
}
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

## DELETE `/api/services/:sid`

Elimina un servicio almacenado en MongoDB.

Si existe:

```text
200 OK
```

Si no existe:

```text
404 Not Found
```

---

# Recurso Bookings

El flujo de una operación de reservas es:

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
BookingModel
        ↓
MongoDB Atlas
```

Controller y Service exponen:

```text
createBooking
getBookingById
addServiceToBooking
```

Repository y DAO exponen:

```text
create
getById
update
```

---

# Endpoints de Bookings

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/bookings` | Crea una reserva |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por ID |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

## POST `/api/bookings`

Crea una reserva.

Ejemplo:

```json
{
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-09-25",
  "time": "18:00",
  "status": "pending",
  "services": []
}
```

Si se crea correctamente:

```text
201 Created
```

---

## GET `/api/bookings/:bid`

Obtiene una reserva mediante su `_id`.

Si la reserva no existe o el identificador no es válido:

```text
404 Not Found
```

---

## POST `/api/bookings/:bid/services/:sid`

Agrega un servicio existente a una reserva existente.

Ejemplo:

```http
POST /api/bookings/BOOKING_ID/services/SERVICE_ID
```

No requiere body.

La capa de service comprueba la existencia de la reserva y del servicio antes de modificar la reserva.

La primera vez:

```json
{
  "service": "SERVICE_ID",
  "quantity": 1
}
```

Si se agrega nuevamente:

```json
{
  "service": "SERVICE_ID",
  "quantity": 2
}
```

Si la reserva o el servicio no existen:

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

# Pruebas realizadas

La API puede probarse mediante Thunder Client o Postman.

Durante la migración se verificaron los siguientes flujos:

1. Conexión exitosa con MongoDB Atlas.
2. Creación de servicios en MongoDB.
3. Consulta de servicios.
4. Actualización de servicios.
5. Eliminación de servicios.
6. Creación de reservas.
7. Consulta de reservas.
8. Asociación de un servicio mediante `ObjectId`.
9. Incremento de `quantity` al agregar dos veces el mismo servicio.
10. Persistencia de los documentos en MongoDB Atlas.
11. Respuesta `404` frente a recursos inexistentes o identificadores inválidos.

---

# Migración desde FileSystem

La versión anterior del proyecto utilizaba archivos JSON y `fs/promises` como sistema de persistencia.

La arquitectura en capas permitió reemplazar esa implementación por MongoDB sin modificar los endpoints públicos.

Antes:

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
FileSystem / JSON
```

Actualmente:

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
Mongoose
   ↓
MongoDB Atlas
```

Los controllers continúan gestionando HTTP, los services mantienen las reglas de negocio y los repositories continúan funcionando como abstracción del acceso a datos.

La modificación principal se concentra en la capa de persistencia.

---

# Seguridad y exclusiones del repositorio

El archivo `.gitignore` evita versionar:

```text
node_modules/
.env
```

El repositorio incluye:

```text
.env.example
```

como referencia de las variables necesarias:

```env
PORT=
NODE_ENV=
MONGO_URI=
```

No se incluyen usuarios, contraseñas, URI reales de MongoDB Atlas ni otras credenciales sensibles en el repositorio.