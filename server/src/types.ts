import { Request, Response } from "express";
export type MyContext = {
  req: Request;
  res: Response;
};
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}
