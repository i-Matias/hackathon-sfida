import cors from "cors";
import express from "express";
import { authenticate } from "./middleware/authMiddleware";

const app = express();

// Apply CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.use(authenticate);

export default app;
