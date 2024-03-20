import {
  createBlog,
  getAllBlog,
  getBlogById,
  deleteBlogById,
  updateBlog,
} from "../../modules/blog/blogControllers";
import prisma from "../../DB/db.config";

const blogData = {
  id: 4,
  title: "Muna Madan",
  content: "A painful love story of Muna and Madan",
  author: "Laxmi Prasad Devkota",
  likes: 999,
  userId: 1,
};
const sampleBlogData = [
  {
    id: 1,
    title: "Blog 1",
    content: "Content for Blog 1",
    author: "Author 1",
    likes: 100,
    userId: 1,
  },
  {
    id: 2,
    title: "Blog 2",
    content: "Content for Blog 2",
    author: "Author 2",
    likes: 200,
    userId: 2,
  },
];

// jest.spyOn(prisma.blog, "create");
// jest.spyOn(prisma.blog, "findUnique");
// jest.spyOn(prisma.blog, "findMany");
//  jest.spyOn(prisma.blog, "update");
// jest.spyOn(prisma.blog, "delete");

describe("Blog controller Testing", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("create a blog", () => {
    it("create and save blog successfully", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "create").mockResolvedValue(blogData);
      const createdBlog = await createBlog(blogData);
      expect(createdBlog).toEqual(blogData);
      expect(prisma.blog.create).toHaveBeenCalledWith({ data: blogData });
    });
  });

  describe("list all blogs", () => {
    it("should return all the blogs", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "findMany").mockResolvedValue(sampleBlogData);
      const allBlogs = await getAllBlog();
      // console.log(allBlogs,"checking all blogs")
      expect(allBlogs).toEqual(sampleBlogData);
    });
  });
  describe("get blog by id", () => {
    it("returns a blog by id", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "findUnique").mockResolvedValue(blogData);
      const id = 7;
      const blog = await getBlogById(id);
      //   console.log(blog, "checking blog");
      expect(blog).toBeDefined();
      expect(prisma.blog.findUnique).toHaveBeenCalledWith({
        where: { id: id },
      });
    });
  });
  describe("delete blog by id", () => {
    it("should  delete a blog by id", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "delete").mockResolvedValue(blogData);
      const deletedBlog = await deleteBlogById(blogData.id);
      expect(deletedBlog).toEqual(blogData);
      expect(prisma.blog.delete).toHaveBeenCalledWith({
        where: { id: blogData.id },
      });
    });
  });
  describe("update the blog", () => {
    it("should update the blog by id", async () => {
      jest.clearAllMocks();
      const updatedData = {
        id: blogData.id,
        title: "updated title",
        content: "updated content",
        author: "updated auhor",
        likes: 200,
        userId: 1,
      };
      jest.spyOn(prisma.blog, "update").mockResolvedValue(updatedData);
      const updatedBlog = await updateBlog(blogData.id, updatedData);
      //   console.log(updatedBlog);
      expect(updatedBlog).toEqual(updatedData);
      expect(prisma.blog.update).toHaveBeenCalledWith({
        where: {
          id: blogData.id,
        },
        data: updatedData,
      });
    });
  });
});
