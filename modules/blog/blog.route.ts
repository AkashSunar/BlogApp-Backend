import express from "express";
import {
  createBlog,
  getAllBlog,
  getBlogById,
  deleteBlogById,
  updateBlog,
} from "./blogControllers";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/", createBlog);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlogById);

export default blogRouter;
