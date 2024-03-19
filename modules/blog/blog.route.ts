import express, { Request, Response } from "express";
import { Blog } from "./blog.type";
// import { Blog as blog}from "@prisma/client";
import {
  blogUpdateValidator,
  blogValidator,
} from "../../middlewares/validate-middleware";
import {
  createBlog,
  getAllBlog,
  getBlogById,
  deleteBlogById,
  updateBlog,
} from "./blogControllers";
import { tokenExtractor } from "../../middlewares/userValidators";
// import prisma from "../../DB/db.config";

const blogRouter = express.Router();

blogRouter.get(
  "/",
  async (_req: Request, res: Response): Promise<Response<Blog[]>> => {
    const allBlogs = await getAllBlog();
    return res.status(200).json(allBlogs);
  }
);

blogRouter.get(
  "/:id",
  tokenExtractor,
  async (req: Request, res: Response): Promise<Response<Blog>> => {
    const blogId = parseInt(req.params.id);
    const blog = await getBlogById(blogId);
    return res.status(200).json(blog);
  }
);

blogRouter.post(
  "/",
  blogValidator,
  tokenExtractor,
  async (req: Request, res: Response): Promise<Response<Blog>> => {
    const newBlog = await createBlog(req.body);
    return res.status(201).json(newBlog);
  }
);

blogRouter.put(
  "/:id",
  blogUpdateValidator,
  tokenExtractor,
  async (req: Request, res: Response): Promise<Response<Blog>> => {
    const id = req.body.userId;
    const blogId = parseInt(req.params.id);
    const blog = (await getBlogById(blogId)) as Blog;
    if (!blog) throw new Error("blog doesnt exist");
    if (id !== blog.userId)
      throw new Error("This blog is not created by updating user");
    // const content = req.body;
    await updateBlog(blogId, req.body);
    return res.status(201).json({ msg: "Blog updated successfully" });
  }
);

blogRouter.delete(
  "/:id",
  tokenExtractor,
  async (req: Request, res: Response): Promise<Response<Blog>> => {
    const id = req.body.userId;
    const blogId = parseInt(req.params.id);
    const blog = (await getBlogById(blogId)) as Blog;
    if (!blog) throw new Error("blog doesnt exist");
    if (id !== blog.userId)
      throw new Error("This blog is not created by deleting user");
    await deleteBlogById(blogId);
    return res.status(200).json({ msg: "Deleted successfully" });
  }
);

export default blogRouter;
