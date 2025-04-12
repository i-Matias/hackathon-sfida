import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProduct = async (userId: number, data: any) => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      description: data.description,
      userId: userId,
    },
  });

  return product;
};

const getAllProducts = async (name?: string, category?: string) => {
  const products = await prisma.product.findMany({
    where: {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,  // Filter by name if provided
    },
    include: { user: { select: { username: true } } }, // Optional: Include user details if necessary
  });

  return products;
};

const getProductsByUser = async (userId: number) => {
  const products = await prisma.product.findMany({
    where: { userId },
  });

  return products;
};

const updateProduct = async (productId: number, data: any) => {
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      description: data.description,
    },
  });

  return updatedProduct;
};

const deleteProduct = async (productId: number) => {
  await prisma.product.delete({
    where: { id: productId },
  });
};

export default {
  createProduct,
  getAllProducts,
  getProductsByUser,
  updateProduct,
  deleteProduct,
};
