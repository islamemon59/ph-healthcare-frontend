"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./tokenUtils";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const getTokenSecondsRemaining = (token: string): number => {
  console.log("token received", token);
  if (!token) {
    return 0;
  }

  try {
    const tokenPayload = JWT_ACCESS_SECRET
      ? (jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload)
      : (jwt.decode(token) as JwtPayload);

    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }

    const remainingSeconds = tokenPayload.exp
      ? tokenPayload.exp - Math.floor(Date.now() / 1000)
      : 0;
    return remainingSeconds > 0 ? remainingSeconds : 0;
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};

export const setTokenInCookie = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 60 * 60 * 24,
) => {
  const maxAgeInSeconds = getTokenSecondsRemaining(token);
  await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds || 0);
};
