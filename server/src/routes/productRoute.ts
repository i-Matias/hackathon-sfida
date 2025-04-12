import { Router } from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";

export const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", createProduct);
