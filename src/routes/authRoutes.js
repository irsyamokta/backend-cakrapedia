import { Router } from "express";
import auth, { register, login } from "../controllers/authController.js";

const router = Router();

router.use(auth);
router.post("/register", register);
router.post("/login", login);

export default router;