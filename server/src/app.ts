import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
// import connectRedis from "connect-redis";
// import session from "express-session";
// import Redis from "ioredis";
import { Server } from "socket.io";
import { pool } from "./db";
import { IMessage } from "./types";
import { login, register } from "./routes";
import { __prod__ } from "./constants";
import { createAccessToken, isAuth } from "./auth";
import { verify } from "jsonwebtoken";

// TODO add JWT auth
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get("/", isAuth, (req, res) => {
  console.log(req.body.user);
  res.send(req.body.user);
});
app.post("/refresh_token", (req, res) => {
  const cookie = req.headers["cookie"];
  const token = cookie?.split("=")[1];

  if (!token) {
    res.sendStatus(403);
  }

  verify(token!, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
    if (err) {
      res.sendStatus(401);
    } else {
      const accessToken = createAccessToken({
        id: user!.id,
        username: user!.username,
      });

      res.json({ success: true, accessToken });
    }
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }

  next();
});

io.on("connection", async socket => {
  const SQL = "select * from messages limit 50";
  const res = await pool.query(SQL);
  const messages: IMessage[] = res.rows;

  socket.emit("new message", messages);
  socket.on("message", async (msg: string) => {
    const newMessage: IMessage = {
      msg,
      authorId: 1,
    };

    messages.push(newMessage);

    socket.broadcast.emit("new message", messages);
    socket.emit("new message", messages);
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
