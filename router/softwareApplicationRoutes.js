import express from "express";
import {addNewApplication,deleteApplication,getAllApplication } from "../controller/softwareApplicationController.js";
import {isAuthenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticate, addNewApplication)
router.delete("/delete/:id", isAuthenticate, deleteApplication)
router.get("/getall", getAllApplication)

export default router;