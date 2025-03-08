import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

export const register = catchAsyncError(async (req, res, next) => {
  // Check if avatar and resume files are provided
  if (!req.files || !req.files.avatar || !req.files.resume) {
    return next(new ErrorHandler("Avatar and resume are required", 400));
  }

  const { avatar, resume } = req.files;

  // Upload files to Cloudinary
  const [cloudinaryAvatar, cloudinaryResume] = await Promise.all([
    cloudinary.uploader.upload(avatar.tempFilePath, { folder: "AVATAR" }),
    cloudinary.uploader.upload(resume.tempFilePath, { folder: "RESUME" }),
  ]);

  if (!cloudinaryAvatar || !cloudinaryResume) {
    return next(new ErrorHandler("File upload failed", 500));
  }

  const { fullName, email, phone, aboutMe, password, portfolioURL, githubURL, instagramURL, facebookURL, linkedinURL, threadURL } = req.body;

  // Validate required fields
  if (!fullName || !email || !password || !phone) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return next(new ErrorHandler("Email or phone number already exists", 400));
  }

  // Validate password format
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorHandler("Password must contain at least one letter and one number", 400));
  }

  // Create user (password will be hashed in pre-save hook)
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    linkedinURL,
    threadURL,
    avatar: {
      public_id: cloudinaryAvatar.public_id,
      url: cloudinaryAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResume.public_id,
      url: cloudinaryResume.secure_url,
    },
  });

  // Generate token
  generateToken(user, "User registered successfully", 201, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  generateToken(user, "Logged in successfully", 200, res);
});

export const logout = catchAsyncError(async(req,res,next) =>{
  res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly : true,

  }).json({
    success: true,
    message: "Logout Successfully"
  })
})

export const getUser = catchAsyncError(async(req,res,next) => {

  const user = await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user
  })
}) 


export const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update text fields only if provided
  const updatedData = {
    fullName: req.body.fullName || user.fullName,
    email: req.body.email || user.email,
    phone: req.body.phone || user.phone,
    aboutMe: req.body.aboutMe || user.aboutMe,
    portfolioURL: req.body.portfolioURL || user.portfolioURL,
    githubURL: req.body.githubURL || user.githubURL,
    instagramURL: req.body.instagramURL || user.instagramURL,
    facebookURL: req.body.facebookURL || user.facebookURL,
    linkedinURL: req.body.linkedinURL || user.linkedinURL,
    threadURL: req.body.threadURL || user.threadURL,
  };

  // Handle avatar update
  if (req.files?.avatar) {
    // Delete old avatar
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new avatar
    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.avatar.tempFilePath, {
      folder: "AVATAR",
    });

    updatedData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Handle resume update
  if (req.files?.resume) {
    // Delete old resume
    if (user.resume?.public_id) {
      await cloudinary.uploader.destroy(user.resume.public_id);
    }

    // Upload new resume
    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
      folder: "RESUME",
      resource_type: "raw",
    });

    updatedData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Update user in the database
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export const updatePassword = catchAsyncError(async (req,res,next) => {
  const {currentPassword, newPassword, confirmNewPassword} = req.body;

  if(!currentPassword || !newPassword || !confirmNewPassword)
  {
     return next(new ErrorHandler("Please fill all field", 400))
  }
  const user = await User.findById(req.user.id).select("+password")

  const isPasswordMatched = await user.comparePassword(currentPassword);

  if(!isPasswordMatched)
    {
      return next(new ErrorHandler("Incorrect current password", 400))
   }

   if(newPassword!==confirmNewPassword)
    {
      return next(new ErrorHandler("New Password and confirm new password not matched", 400))
   }
   user.password = newPassword;
   await user.save();
   res.status(200).json({
      success:true,
      message:"Password updated successfully"
   })
   
})

export const getUserForPortfolio = catchAsyncError(async (req,res,next) => {
 
  const id = "67caa66d1a504e8938ff9b14";
  const user = await User.findById(id)
    res.status(200).json({
      success:true,
      user,
   })
   
})

export const forgotPassword = catchAsyncError (async (req,res,next) => {

  const user = await User.findOne({email:req.body.email});

  if(!user) {
     return next(new ErrorHandler("User not found",401 ))
  }
  const resetToken = user.getresetPasswordToken()
;
   await user.save({validateBeforeSave: false});
   const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
   const message = `Your reset Password Token Id: \n\n ${resetPasswordUrl} \n\n if you've not requested for this please ignore this.`;

   try {
    await sendEmail({
      email : user.email,
      subject : "Personal Portfolio Dashboard Recovery Password",
      message
    })
    res.status(200).json({
      success : true,
      message : `Email sent to ${user.email} successfully`
    })
   } catch(error) {
       user.resetPasswordExpire = undefined;
       user.resetPasswordToken = undefined;
       await user.save();
       return next(new ErrorHandler(error.message, 500))
   }
})

export const resetPassword = catchAsyncError(async (req,res,next) =>{
  const {token} = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire : {$gt: Date.now()}
  })

  if(!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
  }

  console.log("Received password:", req.body.password);
console.log("Received confirmPassword:", req.body.confirmPassword);

  if(req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & confirm password do not match"))
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  generateToken(user, "Reset password successfully", 200, res)
})
