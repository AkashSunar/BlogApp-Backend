import { z } from "zod";

export const blogSchema = z.object({
  id: z.number({ required_error: "id is required" }).min(1),
  title: z.string({ required_error: "Title is required" }).min(1),
  content: z.string({ required_error: "Content is required" }).min(1),
  author: z.string({ required_error: "Author is requred" }).min(1),
  likes: z.number({ required_error: "likes is required" }).min(1),
});

export const updateSchema = blogSchema.partial();