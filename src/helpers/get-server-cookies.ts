"use server";
import { cookies } from "next/headers";

export const getCookies = async () => {
  const cookieStore = cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};
