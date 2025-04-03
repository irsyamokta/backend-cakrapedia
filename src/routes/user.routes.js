import express from "express";
import { multerUpload } from "../config/multer.js";
import { getUserProfile, updateUserProfile, requestRoleChange, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkVerifiedUser } from "../middlewares/verifiedUserMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, checkVerifiedUser, getUserProfile);
router.put("/update", authMiddleware, checkVerifiedUser, multerUpload, updateUserProfile);
router.post("/request-role", authMiddleware, checkVerifiedUser, multerUpload, requestRoleChange);
router.delete("/delete", authMiddleware, checkVerifiedUser, deleteUser);

export default router;