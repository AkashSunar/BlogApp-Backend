import { NextFunction, Request, Response } from "express";
export const erroHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  if (err) {
    console.log(err.name);
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token is expired");
    }
    //next()
    return res.status(500).send("Internal Server Error");
  }
};
