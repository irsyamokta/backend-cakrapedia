import express from "express";
import  { hasRole }  from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUsers, reviewRequest, createCategory } from "../controllers/adminController.js";
import { getAllNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/users", authMiddleware, hasRole("ADMIN"), getUsers);
router.get("/news", authMiddleware, hasRole("ADMIN"), getAllNews);
router.put("/review-request", authMiddleware, hasRole("ADMIN"), reviewRequest);
router.post("/create-category", authMiddleware, hasRole("ADMIN"), createCategory);

export default router;