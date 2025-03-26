import express from "express";
import  { isAdmin }  from "../middlewares/adminMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dashboard } from "../services/adminService.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isAdmin, dashboard)

export default router;