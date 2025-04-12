export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: number;
}

export interface ProductRequest {
  id: number;
  productId: number;
  productName: string;
  customerId: number;
  customerName: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "farmer" | "consumer" | "admin";
}
