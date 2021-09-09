import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (_, res) => {
  res.json({ hello: "It is wednesday my dudes" });
});

io.on("connection", socket => {
  console.log(socket);
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  next();
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
