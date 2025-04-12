import { Router } from "express";
import productController from "../controllers/productController";
import { isResourceOwner } from "../middleware/authMiddleware";
import productService from "../services/productService";

export const router = Router();

// Public routes
router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProductById);

// Get user's products - must come before the specific :productId routes
router.get("/products/user", productController.getUserProducts);

// Routes that require ownership check
router.put(
  "/products/:productId",
  isResourceOwner(productService.getProductById, "productId"),
  productController.updateProduct
);

router.delete(
  "/products/:productId",
  isResourceOwner(productService.getProductById, "productId"),
  productController.deleteProduct
);

// Add product
router.post("/products", productController.addProduct);
