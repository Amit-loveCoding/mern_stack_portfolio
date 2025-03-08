import express from "express";
import {
  forgotPassword,  
  getUser,
  getUserForPortfolio,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile
} from "../controller/userController.js";
import { isAuthenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticate, getUser);
router.get("/logout", logout); 
router.get("/portfolio/me", getUserForPortfolio);
router.put("/password/update", isAuthenticate, updatePassword);
router.put("/me/profile/update", isAuthenticate, updateProfile);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
