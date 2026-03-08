import { ApiResponse } from "@/src/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokensWithRefreshToken } from "@/src/services/auth.services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

async function tryRefreshToken(accessToken: string, refreshToken: string):Promise<void>{
if(!isTokenExpiringSoon(accessToken)){
  return;
}

const requestHeaders = await headers();

if(requestHeaders.get("x-token-refreshed") === "1"){
  return; // avoid multiple refresh attempts in the same request
}

try {
  await getNewTokensWithRefreshToken(refreshToken);
} catch (error) {
  console.error("Error refreshing token in http client:", error);
}
}

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if(accessToken && refreshToken){
await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });
  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endPoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endPoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Get request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPost = async <TData>(
  endPoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Post request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPut = async <TData>(
  endPoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Put request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPatch = async <TData>(
  endPoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Patch request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpDelete = async <TData>(
  endPoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endPoint, {
      params: options?.headers,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Delete request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
