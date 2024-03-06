import { Request, NextFunction, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";

export const tokenExtractor = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const tokenArray = req.headers.authorization?.split(" ");
    const token = tokenArray ? tokenArray[tokenArray.length - 1] : undefined;
    const user = Jwt.verify(
      token || "",
      process.env.SECRET || ""
    ) as JwtPayload;
    if (!user) throw new Error("user dont exist");
    req.body.userId = user.id;
    next();
  } catch (error) {
    next(error);
  }
};
