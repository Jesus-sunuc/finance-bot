import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import type {
  ChatRequest,
  ChatResponse,
  AddExpenseRequest,
  DeleteTransactionRequest,
  GenerateReportRequest,
} from "../models/Agent";

export const agentKeys = {
  decisions: ["agent", "decisions"] as const,
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
      const res = await axiosClient.post("/api/agent/chat", request);
      return res.data;
    },
  });
};

export const useAddExpenseFromText = () => {
  return useMutation({
    mutationFn: async (request: AddExpenseRequest): Promise<ChatResponse> => {
      const res = await axiosClient.post("/api/agent/add-expense", request);
      return res.data;
    },
  });
};

export const useAgentDecisions = (limit: number = 10) => {
  return useQuery({
    queryKey: [...agentKeys.decisions, limit],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/agent/decisions?limit=${limit}`);
      return res.data.decisions;
    },
  });
};

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: async (
      request: DeleteTransactionRequest
    ): Promise<ChatResponse> => {
      const res = await axiosClient.post(
        "/api/agent/delete-transaction",
        request
      );
      return res.data;
    },
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: async (
      request: GenerateReportRequest
    ): Promise<ChatResponse> => {
      const res = await axiosClient.post("/api/agent/generate-report", request);
      return res.data;
    },
  });
};
