import { Request, NextFunction, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "../utils/jwt";

export const tokenExtractor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenArray = req.headers.authorization?.split(" ");
    const token = tokenArray ? tokenArray[tokenArray.length - 1] : undefined;
    const refreshToken = String(req.headers["x-authorization"]);
    const { expired, decoded } = verifyJwt(String(token)) as JwtPayload;

    if (decoded) {
      req.body.userId = decoded.id;
    }
    if (expired) {
      const user = Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || ""
      ) as JwtPayload;
      const payload = { email: user.email, id: user.id };
      const newAccessToken = Jwt.sign(payload, process.env.SECRET || "", {
        expiresIn: "3m",
      });
      // console.log(newAccessToken, "checking new access token");
      res.setHeader("x-access-token", newAccessToken);
      req.body.userId = user.id;
    }
    next();
  } catch (error) {
    next(error);
  }
};
