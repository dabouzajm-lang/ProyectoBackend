import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ServiceModel = mongoose.model(
  "Service",
  serviceSchema
);

export default ServiceModel;