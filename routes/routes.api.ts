import express from 'express'
import blogRouter from '../modules/blog/blog.route'

const router = express.Router()

// router.use("/blogs", (_req, res) => {
//     res.send ("welcome to blog page")
// });

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of blogs
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               blogs:
 *                 - id: 1
 *                   title: "Example Blog 1"
 *                   content: "This is the content of Example Blog 1"
 *                 - id: 2
 *                   title: "Example Blog 2"
 *                   content: "This is the content of Example Blog 2"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Delete a blog with the specified ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Blog successfully deleted
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */


/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get particular blog
 *     description: Retrieve a blog of that id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Blog found successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog in the list of blogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog
 *               content:
 *                 type: string
 *                 description: The content of the blog
 *     responses:
 *       201:
 *         description: Successful Creation
 *         content:
 *           application/json:
 *             example:
 *               blog:
 *                 id: 7
 *                 title: "Example Blog 1"
 *                 content: "This is the content of Example Blog 1"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */


router.use('/blogs', blogRouter)
export default router
