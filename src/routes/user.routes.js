import express from "express";
import { multerUpload } from "../config/multer.js";
import { getUsers, getUserById, updateUser, requestRoleChange, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/:userId", authMiddleware, getUserById);
router.patch("/update", authMiddleware, multerUpload, updateUser);
router.post("/request-role", authMiddleware, multerUpload, requestRoleChange);
router.delete("/delete", authMiddleware, deleteUser);

export default router;