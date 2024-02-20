import express from "express";
import apiRouter from "./routes.api";


const router = express.Router();

router.get("/routes", (_req, res) => {
  res.send("from indexrouter");
});
router.use("/api/v1/", apiRouter);

export default router;
