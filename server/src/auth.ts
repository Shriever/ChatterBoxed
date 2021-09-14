import { sign } from "jsonwebtoken";

export interface IUser {
  id: string;
  username: string;
}
export const createAccessToken = (user: IUser) => {
  return sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "45m",
  });
};

export const createRefreshToken = (user: IUser) => {
  return sign(user, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
