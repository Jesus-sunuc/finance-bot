import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import type { Budget, BudgetCreate, BudgetUpdate } from "../models/Budget";

export const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await axiosClient.get<Budget[]>("/api/budgets");
      return response.data;
    },
  });
};

export const useBudget = (budgetId: string) => {
  return useQuery({
    queryKey: ["budgets", budgetId],
    queryFn: async () => {
      const response = await axiosClient.get<Budget>(
        `/api/budgets/${budgetId}`
      );
      return response.data;
    },
    enabled: !!budgetId,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: BudgetCreate) => {
      const response = await axiosClient.post<Budget>("/api/budgets", budget);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: BudgetUpdate;
    }) => {
      const response = await axiosClient.put<Budget>(
        `/api/budgets/${id}`,
        updates
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string) => {
      const response = await axiosClient.delete(`/api/budgets/${budgetId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useSetBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      const response = await axiosClient.post("/api/agent/set-budget", {
        text,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
