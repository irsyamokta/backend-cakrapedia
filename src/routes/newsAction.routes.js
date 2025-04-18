import express from "express";
import { toggleSavedNews, toggleLikeDislike, addComment, deleteComment } from "../controllers/newsAction.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:newsId/save", authMiddleware, toggleSavedNews);
router.post("/:newsId/react", authMiddleware, toggleLikeDislike);
router.post("/:newsId/comment", authMiddleware, addComment);
router.delete("/:commentId/comment/delete", authMiddleware, deleteComment);

export default router;