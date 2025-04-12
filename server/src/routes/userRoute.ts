import { Router } from "express";
import userController from "../controllers/userController";

export const router = Router();

router.post("/login", userController.login);
router.post("/signup", userController.register);
