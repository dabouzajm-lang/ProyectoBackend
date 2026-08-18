Service Manager
Descripción

Service Manager es un proyecto desarrollado con Node.js y ECMAScript Modules (ESM) para gestionar los servicios de un sistema de turnos y reservas.

El proyecto implementa una clase ServiceManager que permite consultar, agregar, actualizar y eliminar servicios.

Los servicios tienen una estructura definida y son cargados inicialmente desde el archivo services.json.

Tecnologías utilizadas
Node.js
JavaScript
ECMAScript Modules (ESM)
dotenv
JSON
Instalación
1. Clonar el repositorio
git clone URL_DEL_REPOSITORIO
2. Ingresar al proyecto
cd ProyectoBackend
3. Instalar las dependencias
npm install

La instalación descargará las dependencias definidas en package.json, incluyendo dotenv.

Ejecución

Antes de ejecutar el proyecto, es necesario configurar las variables de entorno.

Una vez configuradas, iniciar la aplicación con:

npm start

El archivo src/app.js funciona como punto de entrada de la aplicación y contiene ejemplos de uso de los métodos de ServiceManager.

Variables de entorno

El proyecto utiliza las siguientes variables:

Variable	Descripción	Ejemplo
PORT	Puerto de ejecución de la aplicación	8080
NODE_ENV	Entorno en el que se ejecuta la aplicación	development

Crear un archivo .env en la raíz del proyecto:

PORT=8080
NODE_ENV=development

También se incluye un archivo .env.example como referencia:

PORT=
NODE_ENV=

El archivo .env contiene la configuración local y no debe subirse al repositorio.

La configuración y validación de estas variables se realiza en:

src/config/env.config.js

Si alguna variable requerida no está definida, la aplicación finaliza mostrando un mensaje de error indicando cuál es la variable faltante.

Recurso services

El recurso services representa los servicios disponibles dentro de un sistema de turnos y reservas.

Cada servicio posee la siguiente estructura:

{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
Propiedades
Propiedad	Descripción
id	Identificador único del servicio.
name	Nombre del servicio.
description	Descripción del servicio.
duration	Duración del servicio en minutos.
price	Precio del servicio.
category	Categoría a la que pertenece el servicio.
available	Indica si el servicio se encuentra disponible.
Ejemplo de un servicio
{
  id: 1,
  name: "Consulta inicial",
  description: "Consulta general con un profesional.",
  duration: 60,
  price: 15000,
  category: "Consulta",
  available: true
}

Los datos iniciales de los servicios se encuentran en:

src/data/services.json
ServiceManager

La clase ServiceManager se encuentra en:

src/managers/ServiceManager.js

Su responsabilidad es gestionar el recurso services.

Cuenta con los siguientes métodos:

getServices()

Devuelve todos los servicios disponibles.

Ejemplo
const services = serviceManager.getServices();

console.log(services);
Resultado
[
  {
    id: 1,
    name: "Consulta inicial",
    description: "Consulta general con un profesional.",
    duration: 60,
    price: 15000,
    category: "Consulta",
    available: true
  },
  {
    id: 2,
    name: "Sesión de entrenamiento",
    description: "Sesión personalizada de entrenamiento.",
    duration: 60,
    price: 12000,
    category: "Entrenamiento",
    available: true
  }
]
getServiceById(id)

Busca un servicio utilizando su identificador.

Ejemplo
const service = serviceManager.getServiceById(1);

console.log(service);

Si el servicio existe, devuelve el objeto correspondiente.

Si no existe, devuelve null.

const service = serviceManager.getServiceById(999);

console.log(service);
// null
addService(serviceData)

Agrega un nuevo servicio.

Los siguientes campos son obligatorios:

name
description
duration
price
category
available
Ejemplo
const newService = serviceManager.addService({
  name: "Evaluación deportiva",
  description: "Evaluación física inicial.",
  duration: 45,
  price: 10000,
  category: "Evaluación",
  available: true
});

console.log(newService);

El id no se recibe como parámetro. Es generado automáticamente por ServiceManager.

Por ejemplo, el resultado puede ser:

{
  id: 4,
  name: "Evaluación deportiva",
  description: "Evaluación física inicial.",
  duration: 45,
  price: 10000,
  category: "Evaluación",
  available: true
}

Si falta alguno de los campos obligatorios, el método genera un error.

updateService(id, updatedData)

Actualiza los datos de un servicio existente.

Ejemplo
const updatedService = serviceManager.updateService(1, {
  price: 17000,
  available: false
});

console.log(updatedService);

El resultado mantiene el identificador original:

{
  id: 1,
  name: "Consulta inicial",
  description: "Consulta general con un profesional.",
  duration: 60,
  price: 17000,
  category: "Consulta",
  available: false
}

El id no puede ser modificado mediante este método.

Por ejemplo:

serviceManager.updateService(1, {
  id: 999,
  price: 20000
});

El servicio continuará teniendo:

id: 1

Si el servicio no existe, el método devuelve null.

deleteService(id)

Elimina un servicio existente.

Ejemplo
const deletedService = serviceManager.deleteService(3);

console.log(deletedService);

El método devuelve el servicio eliminado.

Si el servicio no existe, devuelve null.

const deletedService = serviceManager.deleteService(999);

console.log(deletedService);
// null
Estructura del proyecto
ProyectoBackend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── data/
│   │   └── services.json
│   ├── managers/
│   │   └── ServiceManager.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

node_modules/ y .env son archivos locales y no deben formar parte del repositorio de GitHub.

Comandos principales

Instalar dependencias:

npm install

Ejecutar el proyecto:

npm start
Consideraciones

La lógica de gestión de los servicios se encuentra encapsulada en ServiceManager, mientras que la configuración de las variables de entorno se mantiene separada en env.config.js.

Esta separación permite mantener una estructura organizada y evitar mezclar la lógica de negocio con la configuración de la aplicación.
