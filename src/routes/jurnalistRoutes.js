import express from "express";
import  { isJurnalist }  from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createNews } from "../controllers/jurnalistController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isJurnalist);
router.post("/create-news", authMiddleware, isJurnalist, createNews);

export default router;