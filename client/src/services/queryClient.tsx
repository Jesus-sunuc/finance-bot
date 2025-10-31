/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const addErrorAsToast = async (error: any) => {
  console.error(error);
  const message = getErrorMessage(error);

  toast.error(message, {
    duration: 5000,
  });
};

export function getErrorMessage(error: any) {
  if (error?.response?.status === 422) {
    console.log(error.response.data.detail);
    const serializationMessages = error.response.data.detail.map(
      (d: any) => `${d.type} - ${d.loc[1]}`
    );
    return `Deserialization error on request:\n${serializationMessages.join(
      "\n"
    )}`;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error.response?.data.detail) {
    if (typeof error.response?.data.detail === "string") {
      return error.response?.data.detail;
    } else return JSON.stringify(error.response?.data.detail);
  }
  console.log(error);
  return "Error With Request";
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      onError: addErrorAsToast,
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: addErrorAsToast,
  }),
  mutationCache: new MutationCache({
    onError: addErrorAsToast,
  }),
});

export const getQueryClient = () => {
  return queryClient;
};
