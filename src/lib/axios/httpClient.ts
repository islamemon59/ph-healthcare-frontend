import { ApiResponse } from "@/src/types/api.types";
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getRequestConfig = async (
  options?: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    const { headers } = await import("next/headers");
    const headersList = headers();
    const cookieHeader = (await headersList).get("cookie");
    return {
      ...options,
      headers: {
        ...options?.headers,
        Cookie: cookieHeader,
      },
    };
  }
  return options || {};
};

const httpGet = async <TData>(
  endPoint: string,
  options?: AxiosRequestConfig
): Promise<ApiResponse<TData>> => {
  try {
    const config = await getRequestConfig(options);
    const response = await axiosInstance.get<ApiResponse<TData>>(
      endPoint,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Get request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPost = async <TData>(
  endPoint: string,
  data: unknown,
  options?: AxiosRequestConfig
): Promise<ApiResponse<TData>> => {
  try {
    const config = await getRequestConfig(options);
    const response = await axiosInstance.post<ApiResponse<TData>>(
      endPoint,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Post request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPut = async <TData>(
  endPoint: string,
  data: unknown,
  options?: AxiosRequestConfig
): Promise<ApiResponse<TData>> => {
  try {
    const config = await getRequestConfig(options);
    const response = await axiosInstance.put<ApiResponse<TData>>(
      endPoint,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Put request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpPatch = async <TData>(
  endPoint: string,
  data: unknown,
  options?: AxiosRequestConfig
): Promise<ApiResponse<TData>> => {
  try {
    const config = await getRequestConfig(options);
    const response = await axiosInstance.patch<ApiResponse<TData>>(
      endPoint,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Patch request to ${endPoint} failed: ${error}`);
    throw error;
  }
};

const httpDelete = async <TData>(
  endPoint: string,
  options?: AxiosRequestConfig
): Promise<ApiResponse<TData>> => {
  try {
    const config = await getRequestConfig(options);
    const response = await axiosInstance.delete<ApiResponse<TData>>(
      endPoint,
      config
    );
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
