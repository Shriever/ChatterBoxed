import { sign } from "jsonwebtoken";

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

// export const isAuth = () => {

// }