import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const productService = {
  async getAll() {
    return prisma.product.findMany();
  },
  async create(data: { name: string; description: string }) {
    return prisma.product.create({ data });
  },
};
