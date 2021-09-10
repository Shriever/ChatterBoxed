import express from "express";
import cors from "cors";
import http from "http";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { Server } from "socket.io";
import { pool } from "./db";
import { IMessage } from "./types";
import { login, register } from "./routes";
import { COOKIE_NAME, __prod__ } from "./constants";

const app = express();
const RedisStore = connectRedis(session);
const redis = new Redis(process.env.REDIS_URL);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax",
      secure: __prod__,
      domain: __prod__ ? "" : undefined,
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
    resave: false,
  })
);
app.use(express.json());

app.post("/register", register);
app.post("/login", login);

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
