import express from "express";
import {addNewSkill, deleteSkill, updateSkill,getAllSkills} from "../controller/skillController.js";
import {isAuthenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticate, addNewSkill);
router.delete("/delete/:id", isAuthenticate, deleteSkill);
router.put("/update/:id", isAuthenticate, updateSkill);
router.get("/getall", getAllSkills);

export default router;