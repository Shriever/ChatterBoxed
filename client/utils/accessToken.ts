import jwtDecode from "jwt-decode";

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

interface ITokenData {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

export const getAccessTokenData = () => {
  if (!accessToken) {
    return;
  }
  return jwtDecode(accessToken) as ITokenData;
};
