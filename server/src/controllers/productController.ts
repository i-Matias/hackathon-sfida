import { Request, Response } from "express";
import catchAsync from "../../catchAsync";
import productService from "../services/productService";

const addProduct = catchAsync(async (req: Request, res: Response) => {
  const { name, price, quantity, description } = req.body;

  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Validate required fields
  if (!name || price === undefined || quantity === undefined || !description) {
    return res.status(400).json({
      message: "All fields are required: name, price, quantity, description",
    });
  }

  // Use the authenticated user's ID instead of getting it from the body
  const userId = req.user.id;

  const product = await productService.createProduct(userId, {
    name,
    price,
    quantity,
    description,
  });

  res.status(201).json({
    message: "Product added successfully",
    product,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.query; // Get query params for filtering

  const products = await productService.getAllProducts(name as string);

  res.status(200).json({
    message: "All products fetched successfully",
    products,
  });
});

const getUserProducts = catchAsync(async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Use the user ID from the authentication token
  const userId = req.user.id;

  // Optional: Allow admins to view other users' products by specifying userId in query
  const requestedUserId = req.query.userId ? Number(req.query.userId) : userId;

  // If accessing another user's products, ensure the requester is an admin (roleId 3)
  if (requestedUserId !== userId && req.user.roleId !== 3) {
    return res.status(403).json({
      message: "You can only view your own products",
    });
  }

  const products = await productService.getProductsByUser(requestedUserId);

  res.status(200).json({
    message: `Products for user ${requestedUserId} fetched successfully`,
    products,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, price, quantity, description } = req.body;

  // Ownership is already verified by middleware

  // Validate required fields
  if (!name && price === undefined && quantity === undefined && !description) {
    return res.status(400).json({
      message:
        "At least one field required: name, price, quantity, description",
    });
  }

  const updatedProduct = await productService.updateProduct(Number(productId), {
    name,
    price,
    quantity,
    description,
  });

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  // Ownership is already verified by middleware
  await productService.deleteProduct(Number(productId));

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await productService.getProductById(Number(productId));

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    message: "Product fetched successfully",
    product,
  });
});

export default {
  addProduct,
  getAllProducts,
  getUserProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
