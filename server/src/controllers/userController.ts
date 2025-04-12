import { Request, Response } from "express";
import userService from "../services/userService";
import catchAsync from "../../catchAsync";
import { generateToken } from "../middleware/authMiddleware";
import { hashPassword, comparePasswords } from "../utils/passwordUtils";

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // Find user by email (not password - we'll verify that separately)
  const user = await userService.getUserByEmail(email);

  // Check if user exists
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Verify password (in production we would use bcrypt to compare hashed passwords)
  // If we're not using hashing yet, use direct comparison
  if (user.password !== password) {
    // In real app we would use: !await comparePasswords(password, user.password)
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Generate token
  const token = generateToken(user.id, user.roleId);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    },
    token,
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, roleId, userName } = req.body;

  // Validate required fields
  if (!email || !password || !userName || roleId === undefined) {
    return res.status(400).json({
      message: "All fields are required: email, password, userName, roleId",
    });
  }

  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  // In a real app, we would hash the password
  // const hashedPassword = await hashPassword(password);
  // const user = await userService.register(email, hashedPassword, roleId, userName);
  const user = await userService.register(email, password, roleId, userName);

  // Generate token
  const token = generateToken(user.id, user.roleId);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    },
    token,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userService.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    },
  });
});

export default {
  login,
  register,
  getMe,
};
