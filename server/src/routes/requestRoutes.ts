import express from "express";
import {
  createRequest,
  getUserRequests,
  getFarmerRequests,
  updateRequestStatus,
} from "../controllers/requestController";
import { protect, isCustomer, isFarmer } from "../middleware/authMiddleware";

const router = express.Router();

// Protected routes
router.post("/requests", protect, isCustomer, createRequest);
router.get("/requests", protect, getUserRequests);
router.get("/requests/farmer", protect, isFarmer, getFarmerRequests);
router.put("/requests/:id", protect, isFarmer, updateRequestStatus);

export default router;
