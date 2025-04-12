import { Request, Response } from "express";
import catchAsync from "../../catchAsync";
import requestService from "../services/requestService";
import productService from "../services/productService";

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity, status = "pending" } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Use the authenticated user's ID as the customer ID
  const customerId = req.user.id;

  // Validate required fields
  if (!productId || !quantity) {
    return res.status(400).json({
      message: "Product ID and quantity are required",
    });
  }

  // Check if product exists
  const product = await productService.getProductById(Number(productId));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if quantity is valid
  if (quantity <= 0 || quantity > product.quantity) {
    return res.status(400).json({
      message: `Invalid quantity. Must be between 1 and ${product.quantity}`,
    });
  }

  // Prevent users from creating requests for their own products
  if (product.userId === customerId) {
    return res.status(400).json({
      message: "You cannot request your own product",
    });
  }

  const request = await requestService.createRequest(
    customerId,
    Number(productId),
    Number(quantity),
    status
  );

  res.status(201).json({
    message: "Request created successfully",
    request,
  });
});

const getUserRequests = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Use the authenticated user's ID
  const customerId = req.user.id;

  // Optional: Allow admins to view other users' requests
  const requestedCustomerId = req.query.customerId
    ? Number(req.query.customerId)
    : customerId;

  // Only admins or the user themselves can access their requests
  if (requestedCustomerId !== customerId && req.user.roleId !== 3) {
    return res.status(403).json({
      message: "You can only view your own requests",
    });
  }

  const requests = await requestService.getUserRequests(requestedCustomerId);

  res.status(200).json({
    message: "User requests fetched successfully",
    requests,
  });
});

const getFarmerRequests = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Use the authenticated user's ID as the farmer ID
  const farmerId = req.user.id;

  // Optional: Allow admins to view other farmers' requests
  const requestedFarmerId = req.query.farmerId
    ? Number(req.query.farmerId)
    : farmerId;

  // Only admins or the farmer themselves can access their product requests
  if (requestedFarmerId !== farmerId && req.user.roleId !== 3) {
    return res.status(403).json({
      message: "You can only view requests for your own products",
    });
  }

  const requests = await requestService.getFarmerRequests(requestedFarmerId);

  res.status(200).json({
    message: "Farmer requests fetched successfully",
    requests,
  });
});

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const requestId = Number(req.params.requestId);
  const { status } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Validate status
  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Valid status required: pending, approved, or rejected",
    });
  }

  // Get the request to check ownership
  const request = await requestService.getRequestById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Check if the current user is the owner of the product associated with this request
  const product = await productService.getProductById(request.productId);
  if (!product) {
    return res.status(404).json({ message: "Associated product not found" });
  }

  // Only the product owner or an admin can update the request status
  if (product.userId !== req.user.id && req.user.roleId !== 3) {
    return res.status(403).json({
      message: "You can only update status for requests on your own products",
    });
  }

  const updatedRequest = await requestService.updateRequestStatus(
    requestId,
    status
  );

  res.status(200).json({
    message: "Request status updated successfully",
    request: updatedRequest,
  });
});

export default {
  createRequest,
  getUserRequests,
  getFarmerRequests,
  updateRequestStatus,
};
