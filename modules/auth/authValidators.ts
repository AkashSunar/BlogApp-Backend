import { z } from "zod";

export const authSchema = z.object({
  username: z.string({ required_error: "username is missing" }).min(1),
  password: z.string({ required_error: "password is missing" }).min(1),
  email: z.string({ required_error: "email is required" }).min(1),
  name: z.string({ required_error: "name is required" }).min(1),
  // role: z.string({ required_error: "role is required" }).min(1),
  image: z.string({ required_error: "image is required" }),
});