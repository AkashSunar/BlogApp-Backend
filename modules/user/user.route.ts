import express, { Request, Response } from "express";
import { UserType } from "./user.type";
import multer from "multer";
import {
  getAllUser,
  getUserByid,
  createUser,
  blockUser,
} from "./user.controller";
import { roleValidator } from "../../utils/secure";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    return cb(null, "./public/users");
  },
  filename: function (_req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const userRouter = express.Router();

userRouter.get(
  "/",
  async (_req: Request, res: Response): Promise<Response<UserType[]>> => {
    const allUsers = await getAllUser();
    return res.status(200).json(allUsers);
  }
);

userRouter.get("/:id", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await getUserByid(userId);
  return res.status(200).json(user);
});

userRouter.post(
  "/",
  upload.single("image"),
  roleValidator(["ADMIN"]),
  async (req: Request, res: Response): Promise<Response<UserType>> => {
    if (req?.file) {
      req.body.image = req.file.filename;
    }
    req.body.created_by = (req as any).userId;
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  }
);
userRouter.put(
  "/block/:id",
  roleValidator(["ADMIN"]),
  async (res: Response, req: Request): Promise<Response<any>> => {
    console.log(req.params.id, "xxx");
    const userId = parseInt(req.params.id);
    console.log(userId, "checking user id");
    const result = await blockUser(userId, req.body);
    return res.status(200).json({ data: result, msg: "successful operation" });
  }
);
export default userRouter;
