import express from "express";
import  { hasRole }  from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUsers, reviewRoleRequest, createCategory } from "../controllers/admin.controller.js";
// import { getAllNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/users", authMiddleware, hasRole("ADMIN"), getUsers);
// router.get("/news", authMiddleware, hasRole("ADMIN"), getAllNews);
router.put("/review-request/:requestId", authMiddleware, hasRole("ADMIN"), reviewRoleRequest);
router.post("/create-category", authMiddleware, hasRole("ADMIN"), createCategory);

export default router;