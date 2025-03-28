import express from "express";
import  { isAdmin }  from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDashboard, reviewRequest, createCategory } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isAdmin, getDashboard);
router.put("/review-request", authMiddleware, isAdmin, reviewRequest);
router.post("/create-category", authMiddleware, isAdmin, createCategory);

export default router;