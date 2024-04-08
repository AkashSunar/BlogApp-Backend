import { User } from "@prisma/client";
import prisma from "../../DB/db.config";
import { UserType } from "./user.type";
import bcrypt from "bcrypt";

// import userRouter from "./user.route";

export const getAllUser = async (): Promise<UserType[]> => {
  const response = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      role: true,
      image: true,
    },
  });
  return JSON.parse(JSON.stringify(response));
};

export const getUserByid = async (userId: number): Promise<User> => {
  const response = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      role: true,
      image: true,
    },
  });
  return JSON.parse(JSON.stringify(response));
};

export const createUser = async (user: any): Promise<User> => {
  const saltRounds = 10;
  const {
    name,
    username,
    email,
    image,
    role,
    isArchive,
    created_by,
    updated_by,
  } = user;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const newUser = {
    name,
    username,
    email,
    image,
    role,
    passwordHash,
    isEmailVerified: true,
    isActive: true,
    isArchive,
    created_by,
    updated_by,
  };

  return await prisma.user.create({
    data: newUser,
  });
};

export const blockUser = async (id: number, body: User): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) throw new Error("user is not found");
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: body,
  });
};

export const deleteUser = async (id: number, body: User): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error("user not found");
  return await prisma.user.update({
    where: { id },
    data: body,
  });
};
