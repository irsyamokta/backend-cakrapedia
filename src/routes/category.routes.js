import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/all-category", authMiddleware, hasRole("ADMIN"), getCategories);
router.get("/:categoryId", authMiddleware, hasRole("ADMIN"), getCategoryById);
router.post("/create-category", authMiddleware, hasRole("ADMIN"), createCategory);
router.patch("/update-category/:categoryId", authMiddleware, hasRole("ADMIN"), updateCategory);
router.delete("/delete-category/:categoryId", authMiddleware, hasRole("ADMIN"), deleteCategory);

export default router