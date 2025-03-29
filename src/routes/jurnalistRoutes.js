import express from "express";
import  { isJurnalist }  from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getNews,createNews, updateNews, deleteNews } from "../controllers/jurnalistController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isJurnalist, getNews);
router.post("/create-news", authMiddleware, isJurnalist, createNews);
router.put("/update-news/:newsId", authMiddleware, isJurnalist, updateNews);
router.delete("/delete-news/:newsId", authMiddleware, isJurnalist, deleteNews);

export default router;