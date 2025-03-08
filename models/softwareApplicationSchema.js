import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Application name is required!"],
      trim: true,
    },
    svg: {
      public_id: {
        type: String,
        required: [true, "SVG public ID is required!"],
      },
      url: {
        type: String,
        required: [true, "SVG URL is required!"],
      },
    },
  },
  { timestamps: true }
);

export const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationSchema
);
