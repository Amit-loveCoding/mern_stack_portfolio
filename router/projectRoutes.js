import express from "express";
import {addNewProject, deleteProject, updateProject,getAllProject, getSingleProject} from "../controller/projectController.js";
import {isAuthenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticate, addNewProject);
router.delete("/delete/:id", isAuthenticate, deleteProject);
router.put("/update/:id", isAuthenticate, updateProject);
router.get("/getall", getAllProject);
router.get("/get/:id", getSingleProject);

export default router;