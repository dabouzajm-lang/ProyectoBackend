import express from "express";

import {
  renderServices,
  renderAvailability
} from "../controllers/views.controller.js";

const router = express.Router();

router.get("/services", renderServices);

router.get("/availability", renderAvailability);

export default router;