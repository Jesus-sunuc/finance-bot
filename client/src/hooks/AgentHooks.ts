import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import type {
  ChatRequest,
  ChatResponse,
  AddExpenseRequest,
} from "../models/Agent";
import toast from "react-hot-toast";

export const agentKeys = {
  decisions: ["agent", "decisions"] as const,
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
      const res = await axiosClient.post("/api/agent/chat", request);
      return res.data;
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });
};

export const useAddExpenseFromText = () => {
  return useMutation({
    mutationFn: async (request: AddExpenseRequest): Promise<ChatResponse> => {
      const res = await axiosClient.post("/api/agent/add-expense", request);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Expense added successfully");
    },
    onError: () => {
      toast.error("Failed to parse expense");
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
