import { cookies } from "next/headers";
import { setTokenInCookie } from "../lib/cookieUtils";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!BASE_API_URL) {
  console.error("NEXT_PUBLIC_BASE_API_URL is not defined in .env file.");
}

export async function getNewTokenWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken && refreshToken) {
      await Promise.all([
        setTokenInCookie("accessToken", accessToken),
        setTokenInCookie("refreshToken", newRefreshToken),
      ]);
    }

    if (token) {
      await setTokenInCookie("better-auth.session_token", token, 60 * 60 * 24);
    }

    return true;
  } catch (error) {
    console.error("Error in getNewTokenWithRefreshToken", error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error in getUserInfo", error);
    return null;
  }
}
