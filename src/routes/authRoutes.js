import express from "express";
import { register, login, logout, refreshToken, verifyEmail } from "../controllers/authController.js";
import { changePassword, forgotPassword, resetPassword } from "../controllers/passwordController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/refresh", refreshToken);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/reset-password/:token", resetPassword);
router.post("/logout", authMiddleware, logout);

export default router;