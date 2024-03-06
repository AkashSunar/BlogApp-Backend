import { NextFunction, Request, Response } from "express";

export const erroHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): any => {
  if (err) {
    if (err.name === "TokenExpiredError") {
      res.send("i have to handle expired token");
    }
    return res.json({ message: err.name, myTExt: "akash" });
  }
};
