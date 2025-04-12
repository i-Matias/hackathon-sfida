import { Request, Response } from "express";
import { productService } from "../services/productService";

export async function getAllProducts(req: Request, res: Response) {
  const products = await productService.getAll();
  res.json(products);
}

export async function createProduct(req: Request, res: Response) {
  const newProduct = await productService.create(req.body);
  res.json(newProduct);
}
