// const express = require("express");
import indexRouter from "./routes/index"
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
const app = express();
const PORT = process.env.PORT;
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use("/",indexRouter)      //directs routes to route folder
app.get("/ping", (_req, res) => {
    res.send("pong");
});
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})