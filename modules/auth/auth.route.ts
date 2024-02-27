// import express, { Request, Response } from "express";
// import { getAllAuth } from "./auth.controllers";
// import { Auth } from "./auth.type";
// const authRouter = express.Router();

// authRouter.get(
//   "/",
//   async (_req: Request, res: Response): Promise<Response<Auth[]>> => {
//     const allAuths= await getAllAuth();
//     return res.status(200).json(allAuths);
//   }
// );
// export default authRouter;