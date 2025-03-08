import express from "express";
import {postTimeline,deleteTimeline,getAllTimelines } from "../controller/timelineController.js";
import {isAuthenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticate, postTimeline)
router.delete("/delete/:id", isAuthenticate, deleteTimeline)
router.get("/getall", getAllTimelines)

export default router;