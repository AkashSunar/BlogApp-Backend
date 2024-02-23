import { User } from "@prisma/client";
import prisma from "../../DB/db.config";
import { UserReturnType, UserType } from "./user.type";
import { generateOTP, verifyOTP } from "../../utils/otp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const { name, username, email, image, role } = user;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const newUser = { name, username, email, image, role, passwordHash };
  return await prisma.user.create({
    data: newUser,
  });
};

export const login = async (
  email: string,
  password: string
): Promise<UserReturnType> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("user not found");
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(passwordCorrect && user)) throw new Error("Invalid error or password");
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, process.env.SECRET || "");
  return {
    email: user.email,
    token: token,
  };
};

const generateFPtoken = async (email:string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("user doesn't exist");
  const otpToken = generateOTP();
  const newUser = { email, otpToken };
  await prisma.user.create({
    data: newUser,
  });
  return true;
};
export const forgotPassword = async (email: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("user doesn't exist");
};
