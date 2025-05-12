import express from "express";
import { multerUpload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getNews, getNewsById, getNewsByAuthor, getNewsByCategory, getNewsPublished, createNews, updateNews, deleteNews, newsStatus } from "../controllers/news.controller.js";
import { hasRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/all-news", authMiddleware, hasRole("ADMIN"), getNews);
router.get("/:newsId", authMiddleware, hasRole("ADMIN"), getNewsById);
router.get("/category-news/:categoryId", authMiddleware, getNewsByCategory);
router.get("/author/view", authMiddleware, hasRole("ADMIN", "JURNALIS"), getNewsByAuthor);
router.get("/published/view", getNewsPublished);

router.post("/create-news", authMiddleware, hasRole("ADMIN", "JURNALIS"), multerUpload, createNews);
router.patch("/update-news/:newsId", authMiddleware, hasRole("ADMIN", "JURNALIS"), multerUpload, updateNews);
router.delete("/delete-news/:newsId", authMiddleware, hasRole("ADMIN", "JURNALIS"), deleteNews);

router.patch("/review-news/:newsId", authMiddleware, hasRole("ADMIN"), newsStatus);

export default router;