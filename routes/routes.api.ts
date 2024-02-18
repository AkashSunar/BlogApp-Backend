import express from "express";
import blogRouter from "../modules/blog/blog.route";

const router = express.Router();

// router.use("/blogs", (_req, res) => {
//     res.send ("welcome to blog page")
// });

router.use("/blogs",blogRouter)
export default router;