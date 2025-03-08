import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

// Send a Message
export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { senderName, subject, message } = req.body;

  // Validate input
  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please fill in all fields!", 400));
  }

  // Additional security validations (in case schema validation is bypassed)
  if (senderName.length < 2 || senderName.length > 50) {
    return next(new ErrorHandler("Sender name must be between 2 and 50 characters!", 400));
  }
  if (subject.length < 2 || subject.length > 100) {
    return next(new ErrorHandler("Subject must be between 2 and 100 characters!", 400));
  }
  if (message.length < 2 || message.length > 500) {
    return next(new ErrorHandler("Message must be between 2 and 500 characters!", 400));
  }

  const data = await Message.create({ senderName, subject, message });

  res.status(201).json({
    success: true,
    message: "Message sent successfully!",
    data,
  });
});

// Get All Messages
export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});

// Delete a Message
export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message not found or already deleted!", 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully!",
  });
});
