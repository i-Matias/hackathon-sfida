import { Request, Response } from "express";
import productService from "../services/productService";
import catchAsync from "../../catchAsync";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { name, price, quantity, description } = req.body;
  const userId = req.user.id;

  const product = await productService.createProduct(userId, {
    name,
    price: Number(price),
    quantity: Number(quantity),
    description,
  });

  res.status(201).json({
    product,
  });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const name = req.query.name as string | undefined;
  const products = await productService.getAllProducts(name);

  res.json({
    products,
  });
});

export const getUserProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const userId = req.query.userId ? Number(req.query.userId) : req.user.id;

    // Only allow users to view their own products unless they're an admin
    if (userId !== req.user.id && req.user.roleId !== 3) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const products = await productService.getProductsByUser(userId);

    res.json({
      products,
    });
  }
);

export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    const productId = Number(req.params.id);
    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      product,
    });
  }
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Farmer
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const productId = Number(req.params.id);
  const { name, price, quantity, description } = req.body;

  // Check if product exists
  const product = await productService.getProductById(productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Check if user owns the product or is admin
  if (product.userId !== req.user.id && req.user.roleId !== 3) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const updatedProduct = await productService.updateProduct(productId, {
    name,
    price: price ? Number(price) : undefined,
    quantity: quantity ? Number(quantity) : undefined,
    description,
  });

  res.json({
    product: updatedProduct,
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const productId = Number(req.params.id);

  const product = await productService.getProductById(productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product.userId !== req.user.id && req.user.roleId !== 3) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await productService.deleteProduct(productId);

  res.json({ message: "Product removed" });
});
