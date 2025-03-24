import express from "express";
import { register, login, logout, refreshToken, verifyEmail } from "../controllers/authController.js";
import { changePassword, forgotPassword, resetPassword } from "../controllers/passwordController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkVerifiedUser } from "../middlewares/checkVerifiedUser.js";

const router = express.Router();

router.post("/refresh", refreshToken);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/change-password", authMiddleware, checkVerifiedUser,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/reset-password/:token", resetPassword);
router.post("/logout", authMiddleware, checkVerifiedUser, logout);

export default router;