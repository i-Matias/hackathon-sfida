import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
} from "../controllers/productController";
import { protect, isFarmer } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/products", getProducts);

// Protected routes - Move this route BEFORE the :id route to ensure proper matching
router.get("/products/user", protect, getUserProducts);

// Continue with the ID-based route
router.get("/products/:id", getProductById);

// Other protected routes
router.post("/products", protect, isFarmer, createProduct);
router.put("/products/:id", protect, isFarmer, updateProduct);
router.delete("/products/:id", protect, isFarmer, deleteProduct);

export default router;
