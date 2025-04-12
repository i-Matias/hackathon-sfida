import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/userService";

// Extending Request type to include user property
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

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId: number, roleId: number): string => {
  return jwt.sign({ id: userId, roleId }, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

export const verifyToken = (
  token: string
): { id: number; roleId: number } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; roleId: number };
  } catch (error) {
    return null;
  }
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Attach user info to request object
  req.user = {
    id: decoded.id,
    roleId: decoded.roleId,
  };

  next();
};

// Check if user is a specific role
export const hasRole = (roleId: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.roleId !== roleId) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

// Middleware to check resource ownership
export const isResourceOwner = (
  resourceGetterFn: (id: number) => Promise<any>,
  paramIdField: string,
  ownerIdField: string = "userId"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = Number(req.params[paramIdField]);
      const resource = await resourceGetterFn(resourceId);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if (!req.user || req.user.id !== resource[ownerIdField]) {
        return res.status(403).json({
          message:
            "Forbidden: You don't have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
