import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";

interface ValidationError {
  type: string;
  loc: string[];
}

interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: {
      detail?: string | ValidationError[];
    };
  };
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  const axiosError = error as AxiosErrorResponse;

  if (axiosError?.response?.status === 422) {
    const details = axiosError.response.data?.detail;
    if (Array.isArray(details)) {
      const messages = details.map(
        (d: ValidationError) => `${d.type} - ${d.loc[1]}`
      );
      return `Validation error:\n${messages.join("\n")}`;
    }
  }

  const detail = axiosError?.response?.data?.detail;
  if (detail) {
    return typeof detail === "string" ? detail : JSON.stringify(detail);
  }

  return "Error With Request";
}

const handleError = (error: unknown) => {
  console.error(error);
  toast.error(getErrorMessage(error), { duration: 5000 });
};

export const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        onError: handleError,
        retry: 0,
      },
    },
  });
};
