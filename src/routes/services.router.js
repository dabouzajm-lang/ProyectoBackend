import express from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = express.Router();
const serviceManager = new ServiceManager();

// GET /api/services
router.get("/", (req, res) => {
  const { category, available } = req.query;

  const services = serviceManager.getServices({
    category,
    available
  });

  res.status(200).json(services);
});

// GET /api/services/:sid
router.get("/:sid", (req, res) => {
  const { sid } = req.params;

  const service = serviceManager.getServiceById(sid);

  if (!service) {
    return res.status(404).json({
      error: "Servicio no encontrado"
    });
  }

  res.status(200).json(service);
});

// POST /api/services
router.post("/", (req, res) => {
  try {
    const newService = serviceManager.addService(req.body);

    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// PUT /api/services/:sid
router.put("/:sid", (req, res) => {
  const { sid } = req.params;

  const updatedService = serviceManager.updateService(
    sid,
    req.body
  );

  if (!updatedService) {
    return res.status(404).json({
      error: "Servicio no encontrado"
    });
  }

  res.status(200).json(updatedService);
});

// DELETE /api/services/:sid
router.delete("/:sid", (req, res) => {
  const { sid } = req.params;

  const deletedService = serviceManager.deleteService(sid);

  if (!deletedService) {
    return res.status(404).json({
      error: "Servicio no encontrado"
    });
  }

  res.status(200).json(deletedService);
});

export default router;