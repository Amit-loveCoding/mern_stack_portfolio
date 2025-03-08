import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true, 
    },

    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },

    timeline: {
      from: {
        type: Date,
        required: [true, "Start date is required!"],
      },
      to: {
        type: Date,
        default: null, 
      },
    },
  },
  { timestamps: true }
);

// Adding indexes for optimized search (optional)
timelineSchema.index({ title: 1 });
timelineSchema.index({ "timeline.from": 1 });

export const Timeline = mongoose.model("Timeline", timelineSchema);
