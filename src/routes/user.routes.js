import express from "express";
import { multerUpload } from "../config/multer.js";
import { getUserProfile, updateUserProfile, requestRoleChange, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, multerUpload, updateUserProfile);
router.post("/request-role", authMiddleware, multerUpload, requestRoleChange);
router.delete("/delete", authMiddleware, deleteUser);

export default router;