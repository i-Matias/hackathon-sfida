import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/auth/me", protect, getUserProfile);

// Profile routes
router.get("/users/:id/profile", protect, getUserById);
router.put("/users/:id/profile", protect, updateUserProfile);

export default router;
