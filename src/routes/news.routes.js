import express from "express";
import { multerUpload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getNews, getNewsById, getNewsByAuthor, getNewsByCategory, getNewsPublished, createNews, updateNews, deleteNews, newsStatus } from "../controllers/news.controller.js";
import { hasRole } from "../middlewares/role.middleware.js";

const router = express.Router();

const isAllowed = hasRole("JURNALIS", "EDITOR", "ADMIN");

router.post("/create", authMiddleware, isAllowed, multerUpload, createNews);
router.put("/update/:newsId", authMiddleware, isAllowed, multerUpload, updateNews);
router.delete("/delete/:newsId", authMiddleware, isAllowed, deleteNews);

router.get("/view", authMiddleware, hasRole("ADMIN", "EDITOR"), getNews);
router.get("/view/:newsId", authMiddleware, hasRole("ADMIN", "EDITOR"), getNewsById);
router.put("/review/:newsId", authMiddleware, hasRole("ADMIN", "EDITOR"), newsStatus);
router.get("/category/:categoryId", authMiddleware, getNewsByCategory);
router.get("/author", authMiddleware, isAllowed, getNewsByAuthor);
router.get("/published", getNewsPublished);

export default router;