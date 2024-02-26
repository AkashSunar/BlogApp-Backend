import { Request, Response, NextFunction } from "express";
// import bodyParser from "body-parser";
// const jsonParser = bodyParser.json();
export const blogValidator =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (err) {
      const errorMessage = err.errors[0].message;
      // console.log(err, "checking error");
      res.status(400).json({ msg: errorMessage });
    }
  };
export const userValidator =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body, "outside try-catch");
    try {
      console.log(req.body,"inside try block");
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
     
    } catch (err) {
      console.log(req.body,"inside catch block");
      console.log("xxxx error");
      console.log(err)
      const errorMessage = err.errors[0].message;
      res.status(400).json({ msg: errorMessage });
    }
  };
