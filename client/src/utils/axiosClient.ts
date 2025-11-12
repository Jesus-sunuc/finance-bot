import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { camel_to_snake_serializing_date, snakeToCamel } from "./apiMapper";
import { handleDates } from "./handleDates";

const axiosClient = axios.create({
  timeout: 30000, // 30 second timeout
});

let tokenRetriever: (() => string | undefined) | null = null;

export const setAccessTokenGetter = (
  retriever: () => string | undefined
): void => {
  tokenRetriever = retriever;
};

axiosClient.interceptors.response.use((response: AxiosResponse) => {
  response.data = snakeToCamel(response.data);
  return response;
});

axiosClient.interceptors.response.use((response: AxiosResponse) => {
  handleDates(response.data);
  return response;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retry?: number;
    };

    if (!config || (config._retry && config._retry >= 3)) {
      return Promise.reject(error);
    }

    config._retry = (config._retry || 0) + 1;

    if (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === "ECONNABORTED" ||
      error.message.includes("Network Error")
    ) {
      const delay = Math.pow(2, config._retry - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Retrying request (attempt ${config._retry}/3)...`);
      return axiosClient(config);
    }

    if (error.response) {
      const errorMessage =
        error.response.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
          ? (error.response.data as { detail: string }).detail
          : `Server error: ${error.response.status}`;

      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (tokenRetriever) {
    const token = tokenRetriever();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.data instanceof FormData) {
    return config;
  }

  config.data = camel_to_snake_serializing_date(config.data);
  return config;
});

export { axiosClient };
