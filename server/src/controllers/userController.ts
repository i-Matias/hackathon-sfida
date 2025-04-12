import { Request, Response } from "express";
import { userService } from "../services/userService";

export async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAll();
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const newUser = await userService.create(req.body);
  res.json(newUser);
}
