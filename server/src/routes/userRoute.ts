import { Router } from "express";
import { getAllUsers, createUser } from "../controllers/userController";

export const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);
