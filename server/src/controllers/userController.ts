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
