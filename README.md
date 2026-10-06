# Sistema Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para gestionar servicios y reservas.

El proyecto utiliza **MongoDB Atlas** como sistema de persistencia y está organizado mediante una arquitectura en capas que separa las responsabilidades entre routers, middlewares de validación, controllers, services, repositories y DAO.

La aplicación incorpora consultas avanzadas con filtros, paginación y ordenamiento, validación de datos mediante **Zod**, relaciones entre colecciones mediante referencias `ObjectId` y consultas con `populate()`.

También incluye vistas renderizadas con **Express Handlebars** y actualización en tiempo real mediante **Socket.io**.

---

# Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- ECMAScript Modules (ESM)
- MongoDB Atlas
- Mongoose
- Zod
- dotenv
- Async/Await
- Express Handlebars
- Socket.io
- HTML5
- CSS3

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

Esto instalará las dependencias declaradas en `package.json`, incluyendo Express, dotenv, Mongoose, Express Handlebars, Socket.io y Zod.

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
│   │   ├── bookings.controller.js
│   │   └── views.controller.js
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
│   ├── validators/
│   │   ├── service.validator.js
│   │   └── booking.validator.js
│   │
│   ├── middlewares/
│   │   └── validate.middleware.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   ├── bookings.router.js
│   │   └── views.router.js
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── services.handlebars
│   │   └── availability.handlebars
│   │
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── socket.js
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

La aplicación utiliza una arquitectura en capas para separar las responsabilidades HTTP, la validación, la lógica de negocio y el acceso a datos.

El flujo general de una petición es:

```text
Router
   ↓
Validation Middleware (Zod)
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

Esta separación permite modificar o ampliar una capa sin acoplar innecesariamente el resto de la aplicación.

---

## Router

Los routers definen los endpoints de la API y conectan cada ruta con sus middlewares y controllers correspondientes.

```text
src/routes/services.router.js
src/routes/bookings.router.js
src/routes/views.router.js
```

No contienen reglas de negocio ni realizan consultas directas a MongoDB.

---

## Validation Middleware

La validación de los datos de entrada se realiza mediante **Zod**.

Los schemas se encuentran separados de las rutas:

```text
src/validators/service.validator.js
src/validators/booking.validator.js
```

El middleware reutilizable se encuentra en:

```text
src/middlewares/validate.middleware.js
```

La validación se ejecuta antes del controller, evitando que datos inválidos alcancen la lógica de negocio o la capa de persistencia.

Actualmente se valida:

- Creación de servicios.
- Actualización de servicios.
- Creación de reservas.
- Identificadores al agregar un servicio a una reserva.

Cuando los datos no cumplen el schema correspondiente, la API responde con:

```text
400 Bad Request
```

junto con información clara sobre los campos inválidos.

---

## Controller

Los controllers reciben las peticiones HTTP.

Sus responsabilidades principales son:

- Leer `req.params`, `req.query` y `req.body`.
- Llamar al service correspondiente.
- Determinar los códigos de estado HTTP.
- Enviar las respuestas mediante `res.status().json()`.
- Emitir eventos de Socket.io cuando corresponde.

```text
src/controllers/services.controller.js
src/controllers/bookings.controller.js
src/controllers/views.controller.js
```

Los objetos `req` y `res` de Express se utilizan en esta capa.

---

## Service

Los services contienen la lógica de negocio y coordinan las operaciones de la aplicación.

```text
src/services/services.service.js
src/services/bookings.service.js
```

Entre sus responsabilidades se encuentran:

- Construir los filtros utilizados para consultar servicios.
- Gestionar paginación y ordenamiento.
- Coordinar operaciones entre distintos recursos.
- Gestionar la incorporación de servicios a una reserva.
- Incrementar `quantity` cuando un mismo servicio se agrega más de una vez.

La validación estructural de los datos de entrada se realiza previamente mediante Zod.

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
Model.countDocuments();
```

Para las consultas avanzadas también se utilizan:

```js
.sort();
.skip();
.limit();
```

y para resolver relaciones:

```js
.populate();
```

Los DAO también verifican el formato de los identificadores antes de realizar determinadas consultas que requieren un `ObjectId`.

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

La aplicación define tres modelos:

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

Ejemplo:

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

Ejemplo conceptual de cómo se almacena una reserva:

```json
{
  "_id": "ObjectId generado por MongoDB",
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "18:00",
  "status": "pending",
  "services": [
    {
      "service": "ObjectId del servicio",
      "quantity": 1
    }
  ]
}
```

---

## Message Model

El proyecto también incluye:

```text
src/models/message.model.js
```

Este modelo prepara el recurso `messages`.

Actualmente no se agregaron endpoints específicos para mensajes, ya que el proyecto mantiene como recursos principales los servicios y las reservas.

---

# Referencias entre Booking y Service

Los servicios asociados a una reserva **no se almacenan como objetos completos**.

Cada elemento del array `services` posee la estructura:

```text
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` está definido en Mongoose mediante una referencia:

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

Cuando un servicio se agrega por primera vez a una reserva:

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

Al tratarse de una regla de negocio, no se encuentra en el DAO ni en el modelo de Mongoose.

---

# Recurso Services

El flujo de una operación relacionada con servicios es:

```text
services.router.js
        ↓
validate.middleware.js
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

Controller y Service exponen operaciones para:

```text
getServices
getServiceById
createService
updateService
deleteService
```

Repository y DAO incluyen operaciones como:

```text
getAll
getPaginated
getById
create
update
delete
```

---

# Endpoints de Services

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/services` | Consulta servicios con filtros, paginación y ordenamiento |
| `GET` | `/api/services/:sid` | Obtiene un servicio por ID |
| `POST` | `/api/services` | Crea un servicio |
| `PUT` | `/api/services/:sid` | Actualiza un servicio |
| `DELETE` | `/api/services/:sid` | Elimina un servicio |

---

## GET `/api/services`

Obtiene servicios almacenados en MongoDB utilizando consultas avanzadas.

### Query params disponibles

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `category` | Filtra por categoría | `Salud` |
| `available` | Filtra por disponibilidad | `true` |
| `page` | Página solicitada | `1` |
| `limit` | Cantidad de resultados por página | `5` |
| `sortBy` | Campo utilizado para ordenar | `price` |
| `order` | Dirección del ordenamiento | `asc` |

Ejemplo por categoría:

```http
GET /api/services?category=Salud
```

Por disponibilidad:

```http
GET /api/services?available=true
```

Con paginación:

```http
GET /api/services?page=1&limit=5
```

Ordenados por precio:

```http
GET /api/services?sortBy=price&order=asc
```

También es posible combinar todos los parámetros:

```http
GET /api/services?category=Salud&available=true&page=1&limit=5&sortBy=price&order=asc
```

Los filtros, el ordenamiento y la paginación se ejecutan mediante MongoDB/Mongoose.

La respuesta contiene los servicios encontrados y los metadatos de paginación:

```json
{
  "services": [
    {
      "_id": "SERVICE_ID",
      "name": "Kinesiología",
      "description": "Sesión de recuperación y movilidad.",
      "duration": 50,
      "price": 20000,
      "category": "Salud",
      "available": true
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "hasPrevPage": false,
    "hasNextPage": false
  }
}
```

El salto utilizado para la paginación se calcula mediante:

```text
(page - 1) * limit
```

Los campos admitidos para `sortBy` son:

```text
name
duration
price
category
available
createdAt
```

Los valores admitidos para `order` son:

```text
asc
desc
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

La petición es validada mediante Zod antes de ejecutar el controller.

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

Si los datos son inválidos:

```text
400 Bad Request
```

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

La petición es validada mediante Zod.

Debe enviarse al menos un campo válido para actualizar.

Si existe:

```text
200 OK
```

Si los datos son inválidos:

```text
400 Bad Request
```

Si el servicio no existe:

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

# Consultas avanzadas

El endpoint:

```text
GET /api/services
```

permite combinar filtros, paginación y ordenamiento.

La consulta se procesa a través de:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
MongoDB
```

El DAO utiliza `find()`, `sort()`, `skip()`, `limit()` y `countDocuments()` para evitar obtener todos los documentos y paginarlos posteriormente en memoria.

Ejemplo:

```http
GET /api/services?category=Salud&available=true&page=2&limit=10&sortBy=price&order=desc
```

La respuesta informa:

- Cantidad total de resultados.
- Página actual.
- Límite por página.
- Cantidad total de páginas.
- Existencia de una página anterior.
- Existencia de una página siguiente.

---

# Validación con Zod

La API utiliza **Zod** como capa independiente de validación.

Los schemas están separados de las rutas y de los modelos de Mongoose.

```text
src/validators/service.validator.js
src/validators/booking.validator.js
```

El middleware:

```text
src/middlewares/validate.middleware.js
```

ejecuta `safeParse()` sobre los datos recibidos.

Si la validación falla, la petición finaliza con:

```text
400 Bad Request
```

antes de alcanzar el controller y la capa de persistencia.

---

## Ejemplo de validación incorrecta de Service

Petición:

```json
{
  "name": "",
  "description": "",
  "duration": -30,
  "price": -1000,
  "category": "",
  "available": "si"
}
```

Respuesta conceptual:

```json
{
  "error": "Datos inválidos",
  "details": [
    {
      "field": "name",
      "message": "El nombre es obligatorio"
    },
    {
      "field": "duration",
      "message": "La duración debe ser mayor a 0"
    },
    {
      "field": "price",
      "message": "El precio no puede ser negativo"
    },
    {
      "field": "available",
      "message": "La disponibilidad debe ser true o false"
    }
  ]
}
```

---

## Operaciones validadas

Zod se aplica actualmente sobre:

```text
POST /api/services
PUT /api/services/:sid
POST /api/bookings
POST /api/bookings/:bid/services/:sid
```

En el último endpoint, `bid` y `sid` son validados como identificadores `ObjectId`.

Por ejemplo:

```http
POST /api/bookings/123/services/456
```

es rechazado con:

```text
400 Bad Request
```

antes de intentar realizar una operación sobre MongoDB.

---

# Recurso Bookings

El flujo de una operación de reservas es:

```text
bookings.router.js
        ↓
validate.middleware.js
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

Entre las operaciones disponibles se encuentran:

```text
createBooking
getBookingById
getBookingByIdPopulated
addServiceToBooking
```

Repository y DAO incluyen operaciones como:

```text
create
getById
getByIdPopulated
update
```

---

# Endpoints de Bookings

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/bookings` | Crea una reserva |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por ID utilizando populate |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

---

## POST `/api/bookings`

Crea una reserva.

Los datos son validados mediante Zod antes de ejecutar la lógica de negocio.

Ejemplo:

```json
{
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "18:00",
  "status": "pending"
}
```

Si se crea correctamente:

```text
201 Created
```

Si los datos son inválidos:

```text
400 Bad Request
```

---

## GET `/api/bookings/:bid`

Obtiene una reserva mediante su `_id`.

La consulta utiliza `populate()` de Mongoose para resolver las referencias almacenadas en:

```text
services.service
```

En MongoDB, la reserva mantiene únicamente la referencia:

```json
{
  "service": "SERVICE_ID",
  "quantity": 1
}
```

Al consultar la reserva mediante la API, `populate()` devuelve los datos completos del servicio asociado.

Ejemplo conceptual:

```json
{
  "_id": "BOOKING_ID",
  "clientName": "Juan Manuel",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "18:00",
  "status": "pending",
  "services": [
    {
      "service": {
        "_id": "SERVICE_ID",
        "name": "Kinesiología",
        "description": "Sesión de recuperación y movilidad.",
        "duration": 50,
        "price": 20000,
        "category": "Salud",
        "available": true
      },
      "quantity": 1
    }
  ]
}
```

Esto permite mantener una estructura normalizada en MongoDB sin duplicar la información completa de cada servicio dentro de las reservas.

Si la reserva no existe o el identificador no es válido:

```text
404 Not Found
```

---

# Populate de Mongoose

Para resolver la relación entre reservas y servicios se utiliza:

```js
.populate("services.service")
```

La persistencia continúa almacenando:

```text
Booking
  ↓
services[]
  ↓
service: ObjectId
  ↓
Service
```

Mientras que la respuesta de la API puede devolver:

```text
Booking
  ↓
services[]
  ↓
service
  ├── _id
  ├── name
  ├── description
  ├── duration
  ├── price
  ├── category
  └── available
```

De esta forma se mantienen las ventajas de trabajar con referencias entre colecciones y, al mismo tiempo, se puede entregar al cliente la información completa relacionada.

---

## POST `/api/bookings/:bid/services/:sid`

Agrega un servicio existente a una reserva existente.

Ejemplo:

```http
POST /api/bookings/BOOKING_ID/services/SERVICE_ID
```

No requiere body.

Los parámetros `bid` y `sid` son validados mediante Zod antes de continuar con la operación.

La capa de service comprueba posteriormente la existencia de la reserva y del servicio.

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

Si los identificadores no tienen un formato válido:

```text
400 Bad Request
```

---

# Códigos de estado HTTP

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos o parámetros inválidos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

---

# Pruebas realizadas

La API puede probarse mediante Thunder Client o Postman.

Durante el desarrollo se verificaron los siguientes flujos:

1. Conexión exitosa con MongoDB Atlas.
2. Creación de servicios en MongoDB.
3. Consulta de servicios.
4. Actualización de servicios.
5. Eliminación de servicios.
6. Creación de reservas.
7. Consulta de reservas.
8. Asociación de servicios mediante referencias `ObjectId`.
9. Incremento de `quantity` al agregar dos veces el mismo servicio.
10. Filtrado de servicios mediante `category`.
11. Filtrado de servicios mediante `available`.
12. Paginación mediante `page` y `limit`.
13. Ordenamiento mediante `sortBy` y `order`.
14. Combinación de filtros, paginación y ordenamiento.
15. Generación de `total`, `totalPages`, `hasPrevPage` y `hasNextPage`.
16. Validación de creación de servicios mediante Zod.
17. Validación de actualización de servicios mediante Zod.
18. Validación de creación de reservas mediante Zod.
19. Validación de `bid` y `sid` al asociar servicios a reservas.
20. Respuestas `400 Bad Request` frente a datos inválidos.
21. Consulta de reservas utilizando `populate()`.
22. Obtención de los datos completos de servicios asociados a una reserva.
23. Persistencia de las relaciones mediante referencias `ObjectId`.
24. Renderizado de vistas con Handlebars.
25. Actualización en tiempo real mediante Socket.io.
26. Funcionamiento de los endpoints desarrollados en las etapas anteriores.

---

# Migración desde FileSystem

La versión inicial del proyecto utilizaba archivos JSON y `fs/promises` como sistema de persistencia.

La arquitectura en capas permitió reemplazar esa implementación por MongoDB sin acoplar los controllers o las reglas de negocio a una tecnología específica.

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
Validation Middleware
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

Los controllers continúan gestionando HTTP, los services mantienen la lógica de negocio y los repositories continúan funcionando como abstracción del acceso a datos.

---

# Vistas con Handlebars

El proyecto incorpora renderizado del lado del servidor mediante **Express Handlebars**.

Las vistas consultan información real de MongoDB Atlas reutilizando la arquitectura en capas existente.

## Vistas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/views/services` | Listado de servicios |
| `GET` | `/views/availability` | Servicios agrupados por disponibilidad |

Las plantillas se encuentran en:

```text
src/views/layouts/main.handlebars
src/views/services.handlebars
src/views/availability.handlebars
```

Los controllers de vistas utilizan `ServicesService` para obtener la información, sin acceder directamente a los modelos ni a MongoDB.

Las vistas fueron adaptadas para trabajar con la nueva respuesta paginada de servicios sin modificar su funcionamiento externo.

---

# Comunicación en tiempo real con Socket.io

La aplicación utiliza **Socket.io** para comunicar cambios realizados sobre los servicios a los navegadores conectados.

Express y Socket.io comparten el mismo servidor HTTP.

## Evento implementado

```text
services:changed
```

Se emite después de las siguientes operaciones exitosas:

```text
POST /api/services
PUT /api/services/:sid
DELETE /api/services/:sid
```

El evento incluye la acción realizada y el identificador del servicio.

El cliente ubicado en:

```text
src/public/js/socket.js
```

escucha este evento y solicita una nueva versión de la vista actual.

El HTML actualizado es renderizado por Handlebars utilizando información real de MongoDB.

El contenido principal se reemplaza dinámicamente sin recargar la página completa.

---

## Prueba de funcionamiento de Socket.io

1. Iniciar el servidor con `npm start`.
2. Abrir `/views/services`.
3. Abrir `/views/availability` en otra pestaña.
4. Modificar la disponibilidad de un servicio mediante Thunder Client.
5. Verificar que ambas vistas reflejen el cambio automáticamente.

La API REST continúa funcionando junto con las vistas y la comunicación en tiempo real.

---

# Resumen de funcionalidades

El proyecto implementa actualmente:

```text
API REST
├── Services
│   ├── Crear
│   ├── Consultar
│   ├── Actualizar
│   ├── Eliminar
│   ├── Filtrar
│   ├── Paginar
│   └── Ordenar
│
├── Bookings
│   ├── Crear
│   ├── Consultar
│   ├── Asociar servicios
│   ├── Referencias ObjectId
│   ├── quantity
│   └── populate()
│
├── Validación
│   ├── Zod
│   ├── Schemas independientes
│   ├── Middleware reutilizable
│   └── Errores 400
│
├── Persistencia
│   ├── MongoDB Atlas
│   └── Mongoose
│
├── Vistas
│   └── Express Handlebars
│
└── Tiempo real
    └── Socket.io
```

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

---

# Autor

**Juan Manuel da Bouza**

Proyecto desarrollado como parte de la formación en desarrollo Backend con Node.js, Express y MongoDB.