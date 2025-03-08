import express from "express";
import { deleteMessage, getAllMessages, sendMessage } from "../controller/messageController.js";
import {isAuthenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/send", sendMessage)
router.get("/getall", getAllMessages)
router.delete("/delete/:id",isAuthenticate ,deleteMessage)

export default router;