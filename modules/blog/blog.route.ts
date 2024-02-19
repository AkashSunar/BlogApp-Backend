import express,{ Request, Response } from "express";
import { Blog } from "../blog.type";
import {
  createBlog,
  getAllBlog,
  getBlogById,
  deleteBlogById,
  updateBlog,
} from "./blogControllers";

const blogRouter = express.Router();

blogRouter.get("/", async (_req:Request, res: Response):Promise<Response<Blog[]>>=> {
  const allBlogs = await getAllBlog();
   return res.status(200).json(allBlogs);
});

blogRouter.get("/:id", async (req: Request, res: Response):Promise<Response<Blog[]>> => {
  const blogId = parseInt(req.params.id);
  const blog = await getBlogById(blogId);
   return res.status(200).json(blog);
});

blogRouter.post("/", async (req: Request, res:Response):Promise<Response<Blog>>=> {
  const newBlog = await createBlog(req.body);
 return res.status(201).json(newBlog);
});

blogRouter.put("/:id", async (req: Request, res: Response):Promise<Response<Blog>>=> {
  const blogId = parseInt(req.params.id);
  const content = req.body;
  await updateBlog(blogId, content);
  return res.status(201).json({ msg: "Blog updated successfully" });
});

blogRouter.delete("/:id", async (req: Request, res: Response):Promise<Response<Blog>>=> {
  const blogId = parseInt(req.params.id);
  await deleteBlogById(blogId);
  return res.status(200).json({ msg: "Deleted successfully" });
});

export default blogRouter;
