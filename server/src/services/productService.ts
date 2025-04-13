import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define TypeScript interfaces for better type checking
interface ProductData {
  name?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

const createProduct = async (userId: number, data: ProductData) => {
  const product = await prisma.product.create({
    data: {
      name: data.name!,
      price: data.price!,
      quantity: data.quantity!,
      description: data.description!,
      userId: userId,
    },
  });

  return product;
};

const getAllProducts = async (name?: string, category?: string) => {
  const products = await prisma.product.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
    },
    include: { user: { select: { username: true } } },
  });

  return products;
};

const getAllProductsWithUserDetails = async () => {
  return prisma.product.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

const getProductsByUser = async (userId: number) => {
  const products = await prisma.product.findMany({
    where: { userId },
  });

  return products;
};

const updateProduct = async (productId: number, data: ProductData) => {
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });

  return updatedProduct;
};

const deleteProduct = async (productId: number) => {
  // Check if there are any requests for this product first
  const requests = await prisma.productRequest.findMany({
    where: { productId },
  });

  // If there are requests, delete those first
  if (requests.length > 0) {
    await prisma.productRequest.deleteMany({
      where: { productId },
    });
  }

  // Then delete the product
  await prisma.product.delete({
    where: { id: productId },
  });
};

const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { user: { select: { id: true, username: true } } },
  });

  return product;
};

const getProductCount = async () => {
  return prisma.product.count();
};

export default {
  createProduct,
  getAllProducts,
  getAllProductsWithUserDetails,
  getProductsByUser,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductCount,
};
