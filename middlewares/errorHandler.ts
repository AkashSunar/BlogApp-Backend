import { NextFunction, Request, Response } from "express";
export const erroHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  if (err) {
    console.log(err.name);
    // next();
    res.send("i have to handle expired token");
  }
};
