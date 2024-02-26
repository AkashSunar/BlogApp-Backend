import indexRouter from "./routes/index";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
dotenv.config();
// import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import specs from "./documentation/swagger";
import cors from "cors";
import swaggerSpec from "./documentation";

import express from "express";
const app = express();
const PORT = process.env.PORT;
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use(express.json());
// app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter); //directs routes to route folder

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
