import prisma from "../../DB/db.config";
import { Auth } from "./auth.type";

export const getAllAuth = async (): Promise<Auth[]> => {
  const response = await prisma.auth.findMany({
    select: {
      id: true,
      email: true,
      otpToken: true,
    },
  });
  return JSON.parse(JSON.stringify(response));
};
