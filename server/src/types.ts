import { Request, Response } from "express";
export interface IMessage {
  messageId?: number;
  authorId: number;
  msg: string;
  createdAt?: any;
}
export type ExpressFn = (req: Request, res: Response) => Promise<void>;
