import { Router } from "express";
import requestController from "../controllers/requestController";

export const router = Router();

// Create a request
router.post("/requests", requestController.createRequest);

// Get all requests for a user
router.get("/requests", requestController.getUserRequests);

// Get all requests for products owned by a farmer
router.get("/requests/farmer", requestController.getFarmerRequests);

// Update a request status
router.put("/requests/:requestId", requestController.updateRequestStatus);
