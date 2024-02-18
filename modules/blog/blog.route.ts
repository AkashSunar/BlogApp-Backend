import express from "express";
import { createBlog,getAllBlog,getBlogById,deleteBlogById} from "./blogControllers";

const blogRouter = express.Router();

blogRouter.post("/", createBlog)
blogRouter.get("/", getAllBlog)
blogRouter.get("/:id", getBlogById)
blogRouter.delete("/:id",deleteBlogById)

export default blogRouter;