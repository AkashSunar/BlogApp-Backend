import { Request, Response, NextFunction } from "express";
import { blogSchema, updateSchema } from "../modules/blog/blogValidators";
import { userSchema } from "../modules/user/userValidators";

export const blogValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    blogSchema.parse(req.body);
    next();
  } catch (err) {
    const errorMessage = err.errors[0].message;
    res.status(400).json({ msg: errorMessage });
  }
};
export const blogUpdateValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateSchema.parse(req.body);
    next();
  } catch (err) {
    const errorMessage = err.errors[0].message;
    res.status(400).json({ msg: errorMessage });
  }
};
export const userValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email, role, name } = req.body;
    // const image = req.file?.filename;
    const myBody = {
      username,
      password,
      email,
      role,
      name,
      image: req.file?.filename,
    };
    userSchema.parse(myBody);
    next();
  } catch (err) {
    const errorMessage = err.errors[0].message;
    res.status(400).json({ msg: errorMessage });
  }
};
