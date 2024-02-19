import prisma from "../../DB/db.config";

export const createBlog = async (req: any, res: any) => {
  const myBlog = req.body;
  const newBlog = await prisma.blog.create({
    data: myBlog,
  });
  return res.status(201).json(newBlog);
  //   return res.json({ status: 200, data: newBlog, msg: "blog created" });
};

export const getAllBlog = async (_req: any, res: any) => {
  const allBlogs = await prisma.blog.findMany({});
  return res.status(200).json(allBlogs);
};

export const updateBlog = async (req: any, res: any) => {
  const body = req.body;
  const blogId = parseInt(req.params.id);
  await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: { ...body },
  });
  return res.status(200).json({ msg: "blog updated succesfully" });
};

export const getBlogById = async (req: any, res: any) => {
  const blogId = parseInt(req.params.id);
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });
  if (blog) {
    return res.status(200).json(blog);
  }
};

export const deleteBlogById = async (req: any, res: any) => {
  const blogId = parseInt(req.params.id);
  await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });
  res.json({ status: 200, msg: "deleted successfully" });
};
