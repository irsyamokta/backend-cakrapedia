import express from "express";
import { multerUpload } from "../config/multer.js";
import { getProfile, updateProfile, requestRole, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkVerifiedUser } from "../middlewares/checkVerifiedUser.js";

const router = express.Router();

router.get("/profile", authMiddleware, checkVerifiedUser, getProfile);
router.put("/update", authMiddleware, checkVerifiedUser, multerUpload, updateProfile);
router.post("/request-role", authMiddleware, checkVerifiedUser, multerUpload, requestRole);
router.delete("/delete-account", authMiddleware, checkVerifiedUser, deleteUser);

export default router;