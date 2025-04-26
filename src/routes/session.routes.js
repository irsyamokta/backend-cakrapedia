import express from "express";
import { hasRole } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllSessions } from "../controllers/session.controller.js";

const router = express.Router();

router.get("/by-device", authMiddleware, hasRole("ADMIN"), getAllSessions);

export default router;