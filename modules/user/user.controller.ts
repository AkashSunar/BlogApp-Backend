import { User } from "@prisma/client";
import prisma from "../../DB/db.config";
import { Auth } from "../auth/auth.type";
import { UserReturnType, UserType } from "./user.type";
import { generateOTP, verifyOTP } from "../../utils/otp";
import bcrypt from "bcrypt";
import { mailer } from "../../services/mailer";
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
  const {
    name,
    username,
    email,
    image,
    role,
    isEmailVerified,
    isActive,
    isArchive,
  } = user;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const newUser = {
    name,
    username,
    email,
    image,
    role,
    passwordHash,
    isEmailVerified,
    isActive,
    isArchive,
  };

  const otpToken = generateOTP();
  const authUSer = { email: newUser.email, otpToken: +otpToken };
  await prisma.auth.create({
    data: authUSer,
  });
  // console.log(newUser)
  await mailer(user.email, +otpToken);
  return await prisma.user.create({
    data: newUser,
  });
};

export const verify = async (userAuth: Auth) => {
  const { email, otpToken } = userAuth;
  const auth = await prisma.auth.findUnique({
    where: {
      email,
    },
  });
  if (!auth) throw new Error("user is not available");
  const isValidToken = verifyOTP(String(otpToken));
  if (!isValidToken) throw new Error("token is expired");
  const emaiLValid = auth.otpToken === otpToken;
  if (!emaiLValid) throw new Error("there is problem in token");
  await prisma.user.update({
    where: {
      email: email,
    },
    data: { isEmailVerified: true, isActive: true },
  });
  await prisma.auth.delete({
    where: {
      email: email,
    },
  });
  return true;
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
  if (!user.isEmailVerified) throw new Error("Email is not verified");
  if (!user.isActive) throw new Error("Email is not active yet");

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

export const forgetPasswordtoken = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("user doesn't exist");
  const otpToken = Number(generateOTP());
  const newUser = { email, otpToken };
  await prisma.auth.create({
    //creation of authUser
    data: newUser,
  });
  await mailer(email, otpToken);
  return true;
};

export const forgotPassword = async (
  email: string,
  otpToken: number,
  password: string
): Promise<boolean> => {
  const saltRounds = 10;
  const authUser = await prisma.auth.findUnique({
    where: {
      email,
    },
  });
  if (!authUser) throw new Error("user doesn't exist");
  console.log(otpToken,typeof(otpToken),"checking otp token")
  const isValidToken = verifyOTP(String(otpToken));
  console.log(isValidToken,"checking validity")
  if (!isValidToken) throw new Error("provided otp token is not valid");
  const isEmailValid = authUser.otpToken === otpToken;
  if (!isEmailValid) throw new Error(" provided email is not valid");
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordHash: await bcrypt.hash(password, saltRounds),
    },
  });
  await prisma.auth.delete({
    where: {
      email,
    },
  });
  return true;
};
