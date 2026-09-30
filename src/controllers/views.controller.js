import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

// Vista de todos los servicios
export const renderServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();

    res.render("services", {
      title: "Nuestros servicios",
      services: services.map((service) =>
        service.toObject()
      )
    });
  } catch (error) {
    res.status(500).send(
      "Error al cargar la vista de servicios."
    );
  }
};

// Vista de disponibilidad
export const renderAvailability = async (req, res) => {
  try {
    const services = await servicesService.getServices();

    const availableServices = services.filter(
      (service) => service.available === true
    );

    const unavailableServices = services.filter(
      (service) => service.available === false
    );

    res.render("availability", {
      title: "Disponibilidad",
      availableServices: availableServices.map(
        (service) => service.toObject()
      ),
      unavailableServices: unavailableServices.map(
        (service) => service.toObject()
      )
    });
  } catch (error) {
    res.status(500).send(
      "Error al cargar la vista de disponibilidad."
    );
  }
};