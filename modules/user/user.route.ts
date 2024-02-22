import express, { Request, Response } from "express";
import { User } from "./user.type";
import multer from "multer";
import { createUser, getAllUser, getUserByid } from "./user.controller";
// import { date } from "zod";
const userRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    return cb(null, "./public/users");
  },
  filename: function (_req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

userRouter.get(
  "/",
  async (_req: Request, res: Response): Promise<Response<User[]>> => {
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
  "/signup",
  upload.single("image"),
  async (req: Request, res: Response): Promise<Response<User>> => {
    if (req?.file) {
      req.body.image = req.file.filename;
    }
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  }
);

export default userRouter;
