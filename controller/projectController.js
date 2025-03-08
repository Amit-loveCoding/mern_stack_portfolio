import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Project from "../models/projectSchema.js"; // 

export const addNewProject = catchAsyncError(async (req, res, next) => {
 
  if (!req.files || !req.files.projectBanner) {
    return next(new ErrorHandler("Project banner image is required", 400));
  }

  const { projectBanner } = req.files;
  const { title, description, gitRepoLink, projectLink, technologies, stack, deployed } = req.body; 

  if (!title || !description || !gitRepoLink || !projectLink || !technologies || !stack || typeof deployed === 'undefined') {
    return next(new ErrorHandler("All project fields are required", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
    folder: "PROJECT_BANNER",
    resource_type: "image",
  });

  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Cloudinary Error", 500));
  }

 
  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies: technologies.split(','),
    stack: stack.split(','),               
    deployed,                            
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Project added successfully",
    project,
  });
});

export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  const projectBannerPublicId = project.projectBanner.public_id;

  if (projectBannerPublicId) {
    await cloudinary.uploader.destroy(projectBannerPublicId);
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  const { projectBanner } = req.files;
  const { title, description, gitRepoLink, projectLink, technologies, stack, deployed } = req.body;

  if (projectBanner) {
    const cloudinaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
      folder: "PROJECT_BANNER",
      resource_type: "image",
    });

    project.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.gitRepoLink = gitRepoLink || project.gitRepoLink;
  project.projectLink = projectLink || project.projectLink;
  project.technologies = technologies || project.technologies;
  project.stack = stack || project.stack;
  project.deployed = deployed || project.deployed;

  project = await project.save();

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

export const getAllProject = catchAsyncError( async(req,res, next)=>{
  const project = await Project.find();

  if(!project) {
    return next(new ErrorHandler("Project not found", 404))
  }

 
  res.status(200).json({
    success:true,
    mesage: "Getting all project...",
    project
  })

})

export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Project retrieved successfully",
    project,
  });
});





