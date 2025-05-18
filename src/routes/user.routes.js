import express from "express";
import { multerUpload } from "../config/multer.js";
import { getUsers, getUserById, updateUser, deleteUser, deleteUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/all-user", getUsers);
router.get("/:userId", authMiddleware, getUserById);
router.patch("/update-user/:userId", authMiddleware, multerUpload, updateUser);
router.delete("/delete-user", authMiddleware, deleteUser);
router.delete("/delete-user/:userId", authMiddleware, hasRole("ADMIN"), deleteUserById);

export default router;