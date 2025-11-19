import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import { showSuccessToast, showErrorToast } from "../utils/toast";

interface ReceiptUploadResponse {
  success: boolean;
  message: string;
  expense_data?: {
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items?: string[];
    description: string;
    confidence: number;
  };
  filename?: string;
}

interface ReceiptSaveResponse {
  success: boolean;
  message: string;
  expense_data?: {
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items?: string[];
    description: string;
    confidence: number;
  };
  expense_id?: string;
  filename?: string;
}

export const useUploadReceipt = (): UseMutationResult<
  ReceiptUploadResponse,
  Error,
  File
> => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post<ReceiptUploadResponse>(
        "/api/receipts/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        showSuccessToast("Receipt processed successfully!");
      } else {
        showErrorToast(data.message || "Failed to process receipt");
      }
    },
    onError: (error) => {
      console.error("Receipt upload error:", error);
      showErrorToast("Failed to upload receipt");
    },
  });
};

export const useUploadAndSaveReceipt = (): UseMutationResult<
  ReceiptSaveResponse,
  Error,
  File
> => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post<ReceiptSaveResponse>(
        "/api/receipts/upload-and-save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        showSuccessToast("Receipt processed and expense saved!");
      } else {
        showErrorToast(data.message || "Failed to process receipt");
      }
    },
    onError: (error) => {
      console.error("Receipt upload and save error:", error);
      showErrorToast("Failed to upload and save receipt");
    },
  });
};
