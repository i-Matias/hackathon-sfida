import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createRequest = async (
  customerId: number,
  productId: number,
  quantity: number,
  status: string
) => {
  const request = await prisma.productRequest.create({
    data: {
      customerId,
      productId,
      quantity,
      status,
    },
  });

  return request;
};

const getUserRequests = async (customerId: number) => {
  const requests = await prisma.productRequest.findMany({
    where: { customerId },
    include: {
      product: {
        include: {
          user: {
            select: { username: true },
          },
        },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });

  return requests;
};

const getFarmerRequests = async (farmerId: number) => {
  // Get all requests for products owned by this farmer
  const requests = await prisma.productRequest.findMany({
    where: {
      product: {
        userId: farmerId,
      },
    },
    include: {
      product: true,
      customer: {
        select: { id: true, username: true, email: true },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });

  return requests;
};

const updateRequestStatus = async (requestId: number, status: string) => {
  const request = await prisma.productRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return request;
};

const getRequestById = async (requestId: number) => {
  const request = await prisma.productRequest.findUnique({
    where: { id: requestId },
  });

  return request;
};

export default {
  createRequest,
  getUserRequests,
  getFarmerRequests,
  updateRequestStatus,
  getRequestById,
};
