import express from "express";
import { multerUpload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getAllNews, getNewsByAuthor, createNews, updateNews, deleteNews, newsStatus, getNewsPublished, likesDislikes, addComment, savedNews, getNewsByCategory, deleteComment } from "../controllers/newsController.js";
import { hasRole } from "../middlewares/roleMiddleware.js"; 

const router = express.Router();

const isAllowed = hasRole("JURNALIS", "EDITOR", "ADMIN");

router.get("/published", getNewsPublished);

router.post("/:newsId/react", authMiddleware, hasRole("READER"), likesDislikes);
router.post("/:newsId/comment", authMiddleware, hasRole("READER"), addComment);
router.delete("/:commentId/comment/delete", authMiddleware, hasRole("READER"), deleteComment);
router.post("/:newsId/save", authMiddleware, hasRole("READER"), savedNews);
router.get("/:categoryId", authMiddleware, hasRole("READER"), getNewsByCategory);

router.get("/author", authMiddleware, isAllowed, getNewsByAuthor);
router.post("/create", authMiddleware, isAllowed, multerUpload, createNews);
router.put("/update/:newsId", authMiddleware, isAllowed, multerUpload, updateNews);
router.delete("/delete/:newsId", authMiddleware, isAllowed, deleteNews);

router.get("/news", authMiddleware, hasRole("EDITOR"), getAllNews);
router.put("/review/:newsId", authMiddleware, hasRole("EDITOR"), newsStatus);

export default router;
