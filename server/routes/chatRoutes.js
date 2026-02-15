import express from "express";
import {createNewChat, getAllUserChats, getHistory, handleChat, deleteChat} from "../controllers/chatController.js"; 
import auth from "../middleware/auth.js"; 

const router = express.Router();


router.post("/new", auth, createNewChat);
router.get("/all", auth, getAllUserChats);
router.post("/", auth, handleChat);
router.get("/history/:chatId", auth, getHistory);
router.delete('/:chatId', auth, deleteChat);

export default router;
