import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js"; 

export const addNewSkill = catchAsyncError(async (req, res, next) => {
  // Check if SVG files are provided
  if (!req.files || !req.files.svg) {
    return next(new ErrorHandler("Skill Icon/SVG is required", 400));
  }

  const { svg } = req.files;
  const { title, proficiency } = req.body; // Destructuring from body

  if (!title || !proficiency) {
    return next(new ErrorHandler("Title and proficiency are required", 400));
  }

  // Upload file to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "SKILL_ICON",
    resource_type: "image",
  });

  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Cloudinary Error", 500));
  }

  // Save to database
  const skill = await Skill.create({
    title,  // Use title instead of name
    proficiency,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Skill added successfully",
    skill,
  });
});

export const deleteSkill = catchAsyncError( async(req,res, next)=>{

  const  {id} = req.params;
  const skill = await Skill.findById(id);

  if(!skill) {
    return next(new ErrorHandler("Software application not found", 404))
  }
  
  const skillSvgId = skill.svg.public_id;
  await cloudinary.uploader.destroy(skillSvgId)
  
  await skill.deleteOne();
  res.status(200).json({
    success:true,
    mesage: "Skill deleted..."
  })

})

export const updateSkill = catchAsyncError(async (req, res, next) => {
  
  const { id } = req.params;
  let skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }
  
  const { proficiency } = req.body;

  // Update the skill with the new proficiency
  skill = await Skill.findByIdAndUpdate(
    id,
    { proficiency },
    {
      new: true, 
      runValidators: true, 
      useFindAndModify: false, 
    }
  );

  // Return the updated skill in the response
  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});


export const getAllSkills = catchAsyncError( async(req,res, next)=>{
  const skill = await Skill.find();

  if(!skill) {
    return next(new ErrorHandler("Skill not found", 404))
  }

 
  res.status(200).json({
    success:true,
    mesage: "Getting all skill...",
    skill
  })

})





