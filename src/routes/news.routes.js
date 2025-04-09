import express from "express";
import { multerUpload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createNews, updateNews } from "../controllers/news.controller.js";
import { hasRole } from "../middlewares/roleMiddleware.js"; 

const router = express.Router();

const isAllowed = hasRole("JURNALIS", "EDITOR", "ADMIN");

router.post("/create", authMiddleware, isAllowed, multerUpload, createNews);
router.put("/update/:newsId", authMiddleware, isAllowed, multerUpload, updateNews);

export default router;
