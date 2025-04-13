import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import requestRoutes from "./routes/requestRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

// Apply CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", requestRoutes);
app.use("/api", adminRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Server Error",
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : err.message,
    });
  }
);

export default app;
