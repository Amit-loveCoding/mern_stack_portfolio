import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import cloudinary from "cloudinary";

export const addNewApplication = catchAsyncError(async (req, res, next) => {
  // Check if SVG files are provided
  if (!req.files || !req.files.svg) {
    return next(new ErrorHandler("Software application Icon/SVG is required", 400));
  }

  const { svg } = req.files;
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Software name is required", 400));
  }

  // Upload file to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "SVG_ICON",
    resource_type: "image",
  });

  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Cloudinary Error", 500));
  }

  // Save to database
  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url, // Fixed typo
    },
  });

  res.status(201).json({
    success: true,
    message: "New software application added",
    softwareApplication,
  });
});


 export const deleteApplication = catchAsyncError(async(req,res,next)=>{

  const  {id} = req.params;
  const softwareApplication = await SoftwareApplication.findById(id);

  if(!softwareApplication) {
    return next(new ErrorHandler("Software application not found", 404))
  }
  
  const softwareApplicationSvgId = softwareApplication.svg.public_id;
  await cloudinary.uploader.destroy(softwareApplicationSvgId)
  
  await softwareApplication.deleteOne();
  res.status(200).json({
    success:true,
    mesage: "Software application deleted"
  })

 })

 export const getAllApplication = catchAsyncError(async(req,res,next)=>{
    const softwareApplication = await SoftwareApplication.find();

  if(!softwareApplication) {
    return next(new ErrorHandler("Software application not found", 404))
  }

 
  res.status(200).json({
    success:true,
    mesage: "Getting all Software application...",
    softwareApplication
  })

 })