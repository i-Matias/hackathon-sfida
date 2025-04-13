import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const login = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  return user;
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const register = async (
  email: string,
  password: string,
  roleId: number,
  userName: string
) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
      roleId: roleId,
      username: userName,
    },
  });

  return user;
};

const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const updateUser = async (userId: number, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      roleId: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
};

const deleteUser = async (id: number) => {
  // First check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return null;
  }

  // Delete all related records (requests, products) - add cascade delete in your schema

  // Delete the user
  return prisma.user.delete({
    where: { id },
  });
};

const getUserCount = async () => {
  return prisma.user.count();
};

const getUserCountByRole = async (roleId: number) => {
  return prisma.user.count({
    where: { roleId },
  });
};

export default {
  login,
  register,
  getUserByEmail,
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserCount,
  getUserCountByRole,
};
