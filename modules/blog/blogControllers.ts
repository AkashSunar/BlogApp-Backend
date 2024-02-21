import prisma from "../../DB/db.config";
import { Blog } from "./blog.type";

export const createBlog = async (blog: Blog): Promise<Blog> => {
  return await prisma.blog.create({
    data: blog,
  });
};

export const getAllBlog = async (): Promise<Blog[] | null> => {
  return await prisma.blog.findMany({});
};

export const getBlogById = async (id: number): Promise<Blog | null> => {
  return await prisma.blog.findUnique({
    where: {
      id: id,
    },
  });
};

export const updateBlog = async (id: number, content: Blog): Promise<Blog> => {
  return await prisma.blog.update({
    where: {
      id: id,
    },
    data: { ...content },
  });
};

export const deleteBlogById = async (id: number): Promise<Blog> => {
  return await prisma.blog.delete({
    where: {
      id: id,
    },
  });
};
