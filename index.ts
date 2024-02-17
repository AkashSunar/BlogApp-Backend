// const express = require("express");
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
const app = express();
const PORT = process.env.PORT;


app.get("/ping", (_req, res) => {
    res.send("pong");
});
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})