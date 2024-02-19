import prisma from "../../DB/db.config";

export const createBlog = async (blog: any) => {
  return await prisma.blog.create({
    data: blog,
  });
};

export const getAllBlog = async () => {
  return await prisma.blog.findMany({});
};

export const getBlogById = async (id: any) => {
  return await prisma.blog.findUnique({
    where: {
      id: id,
    },
  });
};

export const updateBlog = async (id: any, content: any) => {
  return await prisma.blog.update({
    where: {
      id: id,
    },
    data: { ...content },
  });
};

export const deleteBlogById = async (id: any) => {
  return await prisma.blog.delete({
    where: {
      id: id,
    },
  });
};
