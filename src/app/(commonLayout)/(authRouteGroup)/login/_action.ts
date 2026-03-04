/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/src/lib/axios/httpClient";
import { setTokenInCookie } from "@/src/lib/cookieUtils";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const LoginAction = async (
  payload: ILoginPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return { success: false, message: parsedPayload.error.message };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token } = response.data;

    console.log({accessToken, refreshToken, token});

    setTokenInCookie("accessToken", accessToken);
    setTokenInCookie("refreshToken", refreshToken);
    setTokenInCookie("better-auth.session_token", token, 60 * 60 * 24);

  } catch (error: any) {
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }

  redirect("/dashboard"); // ✅ outside try/catch — no interception issues
};