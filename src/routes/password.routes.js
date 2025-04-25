import express from "express";
import { changeUserPassword, forgotUserPassword, resetUserPassword } from "../controllers/password.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkVerifiedUser } from "../middlewares/verified.middleware.js";

const router = express.Router();

router.post("/change", authMiddleware, checkVerifiedUser, changeUserPassword);
router.post("/forgot", forgotUserPassword);
router.post("/reset", resetUserPassword);
router.get("/reset/:token", resetUserPassword);

export default router;