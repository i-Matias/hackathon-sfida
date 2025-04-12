import express from "express";
import { productRouter } from "./routes/productRoute";
import { userRouter } from "./routes/userRoute";

const app = express();
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
