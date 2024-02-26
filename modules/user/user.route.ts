import express, { Request, Response } from "express";
import { UserType } from "./user.type";
import multer from "multer";
// import { userSchema } from "./userValidators";
// import { userValidator } from "../../middlewares/validate-middleware";
import { createUser, getAllUser, getUserByid, login } from "./user.controller";
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
  "/signup",
  // userValidator(userSchema),
  upload.single("image"),
  async (req: Request, res: Response): Promise<Response<UserType>> => {
    if (req?.file) {
      req.body.image = req.file.filename;
    }
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  }
);
userRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  const result = await login(req.body.email, req.body.password);
  return res.status(200).json(result);
});

export default userRouter;
