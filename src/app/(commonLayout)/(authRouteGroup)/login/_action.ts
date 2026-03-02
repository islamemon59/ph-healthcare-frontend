/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";

export const LoginAction = async (
  payload: ILoginPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.message,
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      payload,
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }
};
