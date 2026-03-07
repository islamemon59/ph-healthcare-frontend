/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDefaultDashboardRoute,
  isValidRedirectRole,
  UserRole,
} from "@/src/lib/authUtils";
import { httpClient } from "@/src/lib/axios/httpClient";
import { setTokenInCookie } from "@/src/lib/cookieUtils";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const LoginAction = async (
  payload: ILoginPayload,
  redirectPath: string,
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

    const { accessToken, refreshToken, token, user } = response.data;

    const { emailVerified, email, needPasswordChange, role } = user;

    await Promise.all([
      setTokenInCookie("accessToken", accessToken),
      setTokenInCookie("refreshToken", refreshToken),
      setTokenInCookie("better-auth.session_token", token, 60 * 60 * 24),
    ]);

    if (!emailVerified) {
      redirect("/verify-email");
    } else if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    } else {
      const targetPath =
        redirectPath && isValidRedirectRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
          console.log("target Path",targetPath);
      redirect(targetPath);
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }

  redirect("/dashboard");
};
