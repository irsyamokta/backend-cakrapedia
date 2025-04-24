import express from "express";
import { register, login, logout, refreshToken, me, verifyEmail } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkVerifiedUser } from "../middlewares/verifiedUserMiddleware.js";

const router = express.Router();

router.post("/refresh", authMiddleware, refreshToken);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.get("/me", authMiddleware, me);

router.post("/logout", authMiddleware, checkVerifiedUser, logout);

export default router;
