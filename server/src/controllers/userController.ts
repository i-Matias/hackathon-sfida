import { Request, Response } from "express";
import userService from "../services/userService";
import catchAsync from "../../catchAsync";

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = userService.login(email, password);

  if (response) {
    res.status(200).json({
      message: "Login successful",
      user: response,
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, roleId, userName } = req.body;

  const response = await userService.register(
    email,
    password,
    roleId,
    userName
  );

  return res.status(201).json({
    message: "User registered successfully",
    user: response,
  });
});

export default {
  login,
  register,
};
