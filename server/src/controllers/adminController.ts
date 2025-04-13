import { Request, Response } from "express";
import userService from "../services/userService";
import productService from "../services/productService";
import requestService from "../services/requestService";
import catchAsync from "../../catchAsync";

// User management
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || req.user.roleId !== 3) {
    return res
      .status(403)
      .json({ error: "Not authorized, admin access required" });
  }

  const users = await userService.getAllUsers();

  res.json({
    users,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || req.user.roleId !== 3) {
    return res
      .status(403)
      .json({ error: "Not authorized, admin access required" });
  }

  const userId = parseInt(req.params.id);

  // Don't allow admin to delete themselves
  if (userId === req.user.id) {
    return res
      .status(400)
      .json({ error: "Cannot delete your own admin account" });
  }

  const deletedUser = await userService.deleteUser(userId);

  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    message: "User deleted successfully",
  });
});

// Product management
export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.roleId !== 3) {
      return res
        .status(403)
        .json({ error: "Not authorized, admin access required" });
    }

    const products = await productService.getAllProductsWithUserDetails();

    res.json({
      products,
    });
  }
);

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || req.user.roleId !== 3) {
    return res
      .status(403)
      .json({ error: "Not authorized, admin access required" });
  }

  const productId = parseInt(req.params.id);
  const product = await productService.deleteProduct(productId);

  //   if (!product) {
  //     return res.status(404).json({ error: "Product not found" });
  //   }

  res.json({
    message: "Product deleted successfully",
  });
});

// Request management
export const getAllRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.roleId !== 3) {
      return res
        .status(403)
        .json({ error: "Not authorized, admin access required" });
    }

    const requests = await requestService.getAllRequestsWithDetails();

    res.json({
      requests,
    });
  }
);

export const updateRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.roleId !== 3) {
      return res
        .status(403)
        .json({ error: "Not authorized, admin access required" });
    }

    const requestId = parseInt(req.params.id);
    const { status } = req.body;

    const request = await requestService.updateRequestStatus(requestId, status);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      request,
    });
  }
);

// Statistics for dashboard
export const getDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.roleId !== 3) {
      return res
        .status(403)
        .json({ error: "Not authorized, admin access required" });
    }

    const userCount = await userService.getUserCount();
    const farmerCount = await userService.getUserCountByRole(1);
    const customerCount = await userService.getUserCountByRole(2);
    const productCount = await productService.getProductCount();
    const pendingRequestCount = await requestService.getRequestCountByStatus(
      "pending"
    );

    res.json({
      stats: {
        totalUsers: userCount,
        totalFarmers: farmerCount,
        totalCustomers: customerCount,
        totalProducts: productCount,
        pendingRequests: pendingRequestCount,
      },
    });
  }
);
