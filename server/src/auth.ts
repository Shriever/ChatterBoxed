import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export const createAccessToken = (userId: number = 5) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "45m",
  });
};

export const createRefreshToken = (userId: number = 5) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const isAuth = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body.user = user;
    return;
  });

  return next();
};
