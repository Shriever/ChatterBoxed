import "dotenv/config";
import express from "express";
import cors from "cors";
import { __prod__ } from "./constants";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
