import express from "express";
import { hasRole } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUsers, getUserRequestRole, updateUserRequestRole, createCategory, getCategories, deleteCategory } from "../controllers/admin.controller.js";
import { deleteUserById } from "../controllers/admin.controller.js";
// import { getAllNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/users", authMiddleware, hasRole("ADMIN"), getUsers);

// router.get("/news", authMiddleware, hasRole("ADMIN"), getAllNews);

router.get("/review-requests", authMiddleware, hasRole("ADMIN"), getUserRequestRole);
router.put("/update-request/:requestId", authMiddleware, hasRole("ADMIN"), updateUserRequestRole);

router.post("/create-category", authMiddleware, hasRole("ADMIN"), createCategory);
router.get("/categories", authMiddleware, hasRole("ADMIN"), getCategories);
router.delete("/delete-category/:categoryId", authMiddleware, hasRole("ADMIN"), deleteCategory);
router.delete("/delete/:userId", authMiddleware, hasRole("ADMIN"), deleteUserById);

export default router;