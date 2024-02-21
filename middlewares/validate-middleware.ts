import { Request, Response, NextFunction } from "express";
export const blogValidator =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (err) {
      const errorMessage = err.errors[0].message;
      //   console.log(err.errors, "checking error");
      res.status(400).json({ msg: errorMessage });
    }
  };
