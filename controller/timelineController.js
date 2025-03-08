import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";

export const postTimeline = catchAsyncError(async (req, res, next) => {
  console.log("Received Request Body:", req.body);  // Debugging the request

  const { title, description, timeline } = req.body;

  // Validate if the 'from' date exists
  if (!timeline || !timeline.from) {
    return next(new ErrorHandler("Start date is required!", 400));
  }

  const newTimeline = await Timeline.create({
    title,
    description,
    timeline,
  });

  res.status(200).json({
    success: true,
    message: "Timeline added successfully",
    newTimeline,
  });
});


export const deleteTimeline = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const timeline = await Timeline.findById(id);

  if (!timeline) {
    return next(new ErrorHandler("Timeline not found", 404));
  }

  await timeline.deleteOne();
  res.status(200).json({
    success: true,
    message: "Timeline deleted",
  });
});

export const getAllTimelines = catchAsyncError(async (req, res, next) => {
  const timelines = await Timeline.find();
  res.status(200).json({
    success: true,
    timelines,
    message: "Getting all data....",
  });
});
