import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllRequests,
  updateRequestStatus,
  getDashboardStats,
} from "../controllers/adminController";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Apply protection and admin check to all admin routes
router.use(protect);
router.use(isAdmin);

// User management routes
router.get("/admin/users", getAllUsers);
router.delete("/admin/users/:id", deleteUser);

// Product management routes
router.get("/admin/products", getAllProducts);
router.delete("/admin/products/:id", deleteProduct);

// Request management routes
router.get("/admin/requests", getAllRequests);
router.put("/admin/requests/:id", updateRequestStatus);

// Dashboard statistics
router.get("/admin/stats", getDashboardStats);

export default router;
