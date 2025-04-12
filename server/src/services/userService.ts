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

export default {
  login,
  register,
};
