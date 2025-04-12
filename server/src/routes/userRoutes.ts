import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/auth/me", protect, getUserProfile);

export default router;
