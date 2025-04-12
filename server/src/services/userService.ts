import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userService = {
  async getAll() {
    return prisma.user.findMany();
  },
  async create(data: { email: string; role: string }) {
    return prisma.user.create({ data });
  },
};
