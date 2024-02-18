import prisma from "../../DB/db.config"

export const createBlog = async (req: any, res:any) => {
    const myBlog = req.body;
    const newBlog = await prisma.blog.create({
        data: myBlog,
    })
    return res.json({status:200,data:newBlog,msg:"blog created"})
    
}
export const getAllBlog = async (_req:any,res:any) => {
    const allBlogs = await prisma.blog.findMany({});
    return res.json({status:200,data:allBlogs,msg:"your all blogs are here"})
}

export const getBlogById = async (req:any,res:any) => {
    const blogId = parseInt(req.params.id);
    const blog = await prisma.blog.findUnique({
        where: {
            id:blogId
        }
    })
    if (blog) {
        return res.json({
            status: 200,
            data: blog,
            msg:"your blog is here"
        })
    }
}
export const deleteBlogById = async (req:any,res:any) => {
    const blogId = parseInt(req.params.id);
    await prisma.blog.delete({
        where: {
            id:blogId
        }
    })
    res.json({status:200,data:"deleted successfully"})
}