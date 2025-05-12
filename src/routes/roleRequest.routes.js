import express from "express";
import { hasRole } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../config/multer.js";
import { getUserRoleRequests, createUserRoleRequest, updateUserRoleRequest, deleteUserRoleRequest } from "../controllers/roleRequest.controller.js";

const router = express.Router();

router.get("/all-requests", authMiddleware, hasRole("ADMIN"), getUserRoleRequests);
router.post("/create-request", authMiddleware, hasRole("READER"), multerUpload, createUserRoleRequest);
router.patch("/update-request/:requestId", authMiddleware, hasRole("ADMIN"), updateUserRoleRequest);
router.delete("/delete-request/:requestId", authMiddleware, hasRole("READER"), deleteUserRoleRequest);

export default router;
