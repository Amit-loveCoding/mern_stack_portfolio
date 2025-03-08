import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, "Sender name is required!"],
      trim: true,
      minLength: [2, "Name must contain at least 2 characters!"],
      maxLength: [50, "Name cannot exceed 50 characters!"],
    },

    subject: {
      type: String,
      required: [true, "Subject is required!"],
      trim: true,
      minLength: [2, "Subject must contain at least 2 characters!"],
      maxLength: [100, "Subject cannot exceed 100 characters!"],
    },

    message: {
      type: String,
      required: [true, "Message content is required!"],
      trim: true,
      minLength: [2, "Message must contain at least 2 characters!"],
      maxLength: [500, "Message cannot exceed 500 characters!"],
    },

    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
