import { Request, Response } from "express";
import catchAsync from "../../catchAsync";
import productService from "../services/productService";


const addProduct = catchAsync(async (req: Request, res: Response) => {
  const { userId, name, price, quantity, description } = req.body;

  const product = await productService.createProduct(userId, {
    name,
    price,
    quantity,
    description,
  });

  res.status(201).json({
    message: 'Product added successfully',
    product,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { name, category } = req.query;  // Get query params for filtering

  const products = await productService.getAllProducts(name as string);

  res.status(200).json({
    message: 'All products fetched successfully',
    products,
  });
});

const getUserProducts = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;
  const products = await productService.getProductsByUser(Number(userId));

  res.status(200).json({
    message: `Products for user ${userId} fetched successfully`,
    products,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, price, quantity, description } = req.body;

  const updatedProduct = await productService.updateProduct(Number(productId), {
    name,
    price,
    quantity,
    description,
  });

  res.status(200).json({
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  await productService.deleteProduct(Number(productId));

  res.status(200).json({
    message: 'Product deleted successfully',
  });
});

export default {
  addProduct,
  getAllProducts,
  getUserProducts,
  updateProduct,
  deleteProduct,
};
