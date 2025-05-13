import express from "express";
import { changeUserPassword, forgotUserPassword, resetUserPassword } from "../controllers/password.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkVerifiedUser } from "../middlewares/verified.middleware.js";

const router = express.Router();

router.patch("/change-password", authMiddleware, checkVerifiedUser, changeUserPassword);
router.post("/forgot-password", forgotUserPassword);
router.get("/reset/:token", resetUserPassword);
router.post("/reset-password/:token", resetUserPassword);

export default router;