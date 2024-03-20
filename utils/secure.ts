import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../DB/db.config";

const roleCheck = (roleFromRequest: string[], userRole: string) => {
  return roleFromRequest.includes(userRole);
};

export const roleValidator = //checks the provided token is of Admin or not

    (roles: string[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        
        const tokenArray = req.headers.authorization?.split(" ");
        const token = tokenArray
          ? tokenArray[tokenArray.length - 1]
          : undefined;
        const userData = Jwt.verify(
          token || "",
          process.env.SECRET || ""
        ) as JwtPayload;
        if (!userData) throw new Error("invalid token");
        const { email } = userData;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User not foud");
          (req as any).userId = user.id
        //   console.log((req as any).userId,"checking userid")
        const isValideRole = roleCheck(roles, user.role);
        if (!isValideRole) throw new Error("user role is unAuthorized");
        console.log("checking role validator")
        next();
      } catch (error) {
        console.log("checking error in error block")
        console.log(error);
        next(error);
      }
    };
