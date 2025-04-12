import { Request, Response } from "express";
import catchAsync from "../../catchAsync";
import productService from "../services/productService";

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const response = await productService.getAllProducts();
});
