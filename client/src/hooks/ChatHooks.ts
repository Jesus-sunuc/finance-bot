import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";

export interface ChatMessage {
  id?: number;
  userId?: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export const chatKeys = {
  all: ["chat-messages"] as const,
  session: (sessionId: string) =>
    ["chat-messages", "session", sessionId] as const,
};

export const useChatMessages = () => {
  return useQuery({
    queryKey: chatKeys.all,
    queryFn: async (): Promise<ChatMessage[]> => {
      const res = await axiosClient.get("/api/chat/messages");
      return res.data;
    },
  });
};

export const useSessionMessages = (sessionId: string) => {
  return useQuery({
    queryKey: chatKeys.session(sessionId),
    queryFn: async (): Promise<ChatMessage[]> => {
      const res = await axiosClient.get(
        `/api/chat/messages/session/${sessionId}`
      );
      return res.data;
    },
    enabled: !!sessionId,
  });
};

export const useSaveChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      message: Omit<ChatMessage, "id" | "userId" | "timestamp">
    ): Promise<{ id: number }> => {
      const res = await axiosClient.post("/api/chat/messages", message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
};

export const useDeleteChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ deleted_count: number }> => {
      const res = await axiosClient.delete("/api/chat/messages");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
};

export const useDeleteSessionMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      sessionId: string
    ): Promise<{ deleted_count: number }> => {
      const res = await axiosClient.delete(
        `/api/chat/messages/session/${sessionId}`
      );
      return res.data;
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      queryClient.invalidateQueries({ queryKey: chatKeys.session(sessionId) });
    },
  });
};
