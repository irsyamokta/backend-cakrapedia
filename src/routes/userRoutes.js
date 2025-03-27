import express from "express";
import { getProfile, updateProfile, requestRole } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkVerifiedUser } from "../middlewares/checkVerifiedUser.js";

const router = express.Router();

router.get("/profile", authMiddleware, checkVerifiedUser, getProfile);
router.put("/update", authMiddleware, checkVerifiedUser, updateProfile);
router.post("/request-role", authMiddleware, checkVerifiedUser, requestRole);

export default router;