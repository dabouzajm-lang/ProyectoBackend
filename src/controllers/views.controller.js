import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

// Vista de todos los servicios
export const renderServices = async (req, res) => {
  try {
    const result =
      await servicesService.getServices({
        limit: 100
        });

    const services = result.services;

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
      const result =
      await servicesService.getServices({
        limit: 100
      });

    const services = result.services;

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