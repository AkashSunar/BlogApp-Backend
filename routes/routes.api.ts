import express from "express";
import blogRouter from "../modules/blog/blog.route";

const router = express.Router();

{
  /*ANOTHER METHOD FOR SWAGGER (DELETE,GET)*/
}
// /**
//  * @swagger
//  * /api/v1/blogs/{id}:
//  *   delete:
//  *     tags:
//  *      - Blog
//  *     summary: Delete a blog
//  *     description: Delete a blog with the specified ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The ID of the blog to delete
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       204:
//  *         description: Blog successfully deleted
//  *       404:
//  *         description: Blog not found
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: Internal Server Error
//  */

// /**
//  * @swagger
//  * /api/v1/blogs/{id}:
//  *   get:
//  *     tags:
//  *      - Blog
//  *     summary: Get particular blog
//  *     description: Retrieve a blog of that id
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The ID of the blog
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Successful response
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Blog found successfully
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: Internal Server Error
//  */

router.use("/blogs", blogRouter);
export default router;
