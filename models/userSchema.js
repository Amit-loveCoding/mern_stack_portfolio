import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },

    aboutMe: {
      type: String,
      required: [true, "About me field is required!"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    resume: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    portfolioURL: {
      type: String,
      required: [true, "Portfolio URL is required"],
      trim: true,
      match: [/^(https?:\/\/)?([\w-]+)\.([a-z]{2,})(\/\S*)?$/, "Invalid portfolio URL"],
    },

    githubURL: { type: String, trim: true },
    instagramURL: { type: String, trim: true },
    facebookURL: { type: String, trim: true },
    linkedinURL: { type: String, trim: true },
    threadURL: { type: String, trim: true },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

  },
  { timestamps: true }
);

// Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getresetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
}

export const User = mongoose.model("User", userSchema);
