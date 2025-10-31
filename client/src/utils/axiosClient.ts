import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { camel_to_snake_serializing_date, snakeToCamel } from "./apiMapper";
import { handleDates } from "./handleDates";

const axiosClient = axios.create();

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
