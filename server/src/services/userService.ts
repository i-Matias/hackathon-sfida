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

export default {
  login,
  register,
  getUserByEmail,
  getUserById,
  updateUser,
};
