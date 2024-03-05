import express, { Request, Response, NextFunction } from "express";
import { UserType } from "../user/user.type";

import {
  createUser,
  login,
  verify,
  forgetPasswordtoken,
  forgotPassword,
  changePasswordToken,
  changePassword,
} from "../auth/auth.controllers";
import multer from "multer";
import { userValidator } from "../../middlewares/validate-middleware";
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    return cb(null, "./public/users");
  },
  filename: function (_req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const authRouter = express.Router();

authRouter.post(
  "/signup",
  upload.single("image"),
  userValidator,
  async (req: Request, res: Response): Promise<Response<UserType>> => {
    if (req?.file) {
      req.body.image = req.file.filename;
    }
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  }
);
authRouter.post(
  "/verify",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const result = await verify(req.body);
      return res.status(200).json({ data: result, msg: "success" });
    } catch (error) {
      console.log(error);
    }
  }
);
authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  const result = await login(req.body.email, req.body.password);
  return res.status(200).json(result);
});

authRouter.post(
  "/FPToken",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      if (!email) throw new Error("Email doesn't exist");
      const result = await forgetPasswordtoken(email);
      return res.status(200).json({ data: result, msg: "success" });
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post(
  "/CPToken",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      if (!email) throw new Error("Email does not exist");
      const result = await changePasswordToken(email);
      return res.status(200).json({ data: result, msg: "success" });
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post(
  "/forget-password",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password, otpToken } = req.body;
      const result = await forgotPassword(email, otpToken, password);
      return res
        .status(200)
        .json({ data: result, msg: "your password updated successfully" });
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post(
  "/change-password",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, otpToken, oldPassword, newPassword } = req.body;
      const result = await changePassword(
        email,
        otpToken,
        oldPassword,
        newPassword
      );
      return res
        .status(200)
        .json({ data: result, msg: "your password is changed successfully" });
    } catch (error) {
      next(error);
    }
  }
);
export default authRouter;
