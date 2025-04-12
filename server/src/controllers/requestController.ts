import { Request, Response } from "express";
import requestService from "../services/requestService";
import productService from "../services/productService";
import catchAsync from "../../catchAsync";

// @desc    Create a new product request
// @route   POST /api/requests
// @access  Private/Customer
export const createRequest = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { productId, quantity } = req.body;
  const customerId = req.user.id;

  // Check if product exists and has enough quantity
  const product = await productService.getProductById(Number(productId));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product.quantity < quantity) {
    return res
      .status(400)
      .json({ error: "Not enough product quantity available" });
  }

  // Create the request
  const request = await requestService.createRequest(
    customerId,
    Number(productId),
    Number(quantity),
    "pending"
  );

  res.status(201).json({
    request,
  });
});

// @desc    Get user requests (for customers)
// @route   GET /api/requests
// @access  Private
export const getUserRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const customerId = req.query.customerId
      ? Number(req.query.customerId)
      : req.user.id;

    // If not the user making the request or not an admin
    if (customerId !== req.user.id && req.user.roleId !== 3) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const requests = await requestService.getUserRequests(customerId);

    res.json({
      requests,
    });
  }
);

// @desc    Get farmer requests (products owned by this farmer)
// @route   GET /api/requests/farmer
// @access  Private/Farmer
export const getFarmerRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const farmerId = req.user.id;
    const requests = await requestService.getFarmerRequests(farmerId);

    res.json({
      requests,
    });
  }
);

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private/Farmer
export const updateRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const requestId = Number(req.params.id);
    const { status } = req.body;

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Get the request
    const request = await requestService.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Get the product to check if this farmer owns it
    const product = await productService.getProductById(request.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user owns the product or is admin
    if (product.userId !== req.user.id && req.user.roleId !== 3) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // If approving, check if there's still enough quantity
    if (status === "approved" && product.quantity < request.quantity) {
      return res
        .status(400)
        .json({ error: "Not enough product quantity available" });
    }

    // If approving, update product quantity
    if (status === "approved") {
      await productService.updateProduct(product.id, {
        quantity: product.quantity - request.quantity,
      });
    }

    const updatedRequest = await requestService.updateRequestStatus(
      requestId,
      status
    );

    res.json({
      request: updatedRequest,
    });
  }
);
