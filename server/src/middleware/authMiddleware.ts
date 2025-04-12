import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        roleId: number;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default-secret"
      ) as jwt.JwtPayload;

      // Get user from the token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, roleId: true },
      });

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, invalid token" });
      return; // Add this return statement to prevent code execution continuing
    }
  } else {
    // If no token, return unauthorized response
    res.status(401).json({ error: "Not authorized, no token provided" });
    return; // Add this return statement to prevent code execution continuing
  }
};

// Middleware to check if user is a farmer
export const isFarmer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.roleId === 1) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized, farmer access required" });
  }
};

// Middleware to check if user is a customer
export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.roleId === 2) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized, customer access required" });
  }
};

// Middleware to check if user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.roleId === 3) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized, admin access required" });
  }
};
