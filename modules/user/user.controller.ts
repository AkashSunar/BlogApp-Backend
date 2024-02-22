import { User } from "@prisma/client";
import prisma from "../../DB/db.config";
// import { User } from "./user.type";
import bcrypt from "bcrypt";

export const getAllUser = async (): Promise<User[]> => {
  return await prisma.user.findMany({});
};

export const getUserByid = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const createUser = async (user: any): Promise<User> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const newUser = { ...user, password: passwordHash };
  return await prisma.user.create({
    data: newUser,
  });
};
