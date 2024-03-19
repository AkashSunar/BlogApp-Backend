import prisma from "../../DB/db.config";
import { Auth } from "./auth.type";
import { User } from "@prisma/client";
import { UserReturnType } from "../user/user.type";
import { generateOTP, verifyOTP } from "../../utils/otp";
import bcrypt from "bcrypt";
import { mailer } from "../../services/mailer";
import jwt from "jsonwebtoken";

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
  // console.log(auth,"checking auth")
  if (!auth) throw new Error("user is not available");
  const isValidToken = verifyOTP(String(otpToken));
  // console.log(isValidToken)
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
  if (!(passwordCorrect && user)) throw new Error("Invalid email or password");
  if (!user.isEmailVerified) throw new Error("Email is not verified");
  if (!user.isActive) throw new Error("Email is not active yet");

  const payload = {
    email: user.email,
    id: user.id,
  };
  const accessToken = jwt.sign(payload, process.env.SECRET || "", {
    expiresIn: "3m",
  });

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "",
    { expiresIn: "1w" }
  );

  // const refreshTokenPayload={userId:user.id,token:refreshToken}
  // await prisma.token.create({data:refreshTokenPayload})

  return {
    email: user.email,
    accessToken,
    refreshToken,
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

export const changePasswordToken = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("user doesn't exist");
  const otpToken = Number(generateOTP());
  const newUser = { email, otpToken };
  await prisma.auth.create({
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
  const isValidToken = verifyOTP(String(otpToken));
  // console.log(isValidToken, "checking validity");
  if (!isValidToken) throw new Error("provided otp token is not valid");
  const isEmailValid = authUser.otpToken === otpToken;
  if (!isEmailValid) throw new Error("there is problem in token");
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

export const changePassword = async (
  email: string,
  otpToken: number,
  oldPassword: string,
  newPassword: string
): Promise<boolean> => {
  const saltRounds = 10;
  const authuser = await prisma.auth.findUnique({
    where: {
      email,
    },
  });
  if (!authuser) throw new Error("auth user doesn't exist");
  const isValidToken = verifyOTP(String(otpToken));
  if (!isValidToken) throw new Error("provided otp token is not valid");
  const isEmailValid = authuser.otpToken === otpToken;
  if (!isEmailValid) throw new Error("email is not valid");
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("user not found");
  const passwordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
  // const passwordCorrect =
  // user?.passwordHash === (await bcrypt.hash(oldPassword, saltRounds));
  // console.log(passwordCorrect, "checking passwordcorrect");
  if (!passwordCorrect)
    throw new Error("old password you provided is incorrect");
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordHash: await bcrypt.hash(newPassword, saltRounds),
    },
  });
  return true;
};
