import { Request, Response } from "express";
import userService from "../services/userService";
import { generateToken } from "../utils/jwt";
import catchAsync from "../../catchAsync";

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, roleId, userName } = req.body;

  // Check if user already exists
  const userExists = await userService.getUserByEmail(email);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Create user
  const user = await userService.register(email, password, roleId, userName);

  if (user) {
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: "Invalid user data" });
  }
});

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.login(email, password);

  if (user) {
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const user = await userService.getUserById(req.user.id);

    if (user) {
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId,
        },
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
);

// @desc    Get user by ID
// @route   GET /api/users/:id/profile
// @access  Private
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const userId = parseInt(req.params.id);

  // Users can only view their own profile unless they're admin
  if (userId !== req.user.id && req.user.roleId !== 3) {
    return res
      .status(403)
      .json({ error: "Not authorized to view this profile" });
  }

  const user = await userService.getUserById(userId);

  if (user) {
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id/profile
// @access  Private
export const updateUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const userId = parseInt(req.params.id);

    // Users can only update their own profile
    if (userId !== req.user.id && req.user.roleId !== 3) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    const { username, email, currentPassword, newPassword } = req.body;

    // Get the current user data
    const currentUser = await userService.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare update data
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    // Handle password change if requested
    if (newPassword) {
      // Verify current password
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Current password is required to change password" });
      }

      if (currentPassword !== currentUser.password) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Update password
      updateData.password = newPassword;
    }

    // Update user
    const updatedUser = await userService.updateUser(userId, updateData);

    if (updatedUser) {
      res.json({
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          roleId: updatedUser.roleId,
        },
      });
    } else {
      res.status(400).json({ error: "Failed to update profile" });
    }
  }
);
