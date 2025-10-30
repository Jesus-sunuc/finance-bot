import axios from "axios";
import { camel_to_snake_serializing_date, snakeToCamel } from "./apiMapper";
import { handleDates } from "./handleDates";

const axiosClient = axios.create();

// Access token getter function
let getAccessToken: (() => string | undefined) | null = null;

export const setAccessTokenGetter = (getter: () => string | undefined) => {
  getAccessToken = getter;
};

axiosClient.interceptors.response.use((originalResponse) => {
  originalResponse.data = snakeToCamel(originalResponse.data);
  return originalResponse;
});

axiosClient.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

axiosClient.interceptors.request.use((config) => {
  // Add Authorization header if token is available
  if (getAccessToken) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.data instanceof FormData) return config;
  config.data = camel_to_snake_serializing_date(config.data);
  return config;
});

const dateOnlyAxiosClient = axios.create();

dateOnlyAxiosClient.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

export { axiosClient, dateOnlyAxiosClient };
