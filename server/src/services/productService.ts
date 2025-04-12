import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

export default {
  getAllProducts,
};
