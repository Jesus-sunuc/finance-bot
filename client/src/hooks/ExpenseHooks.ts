import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../utils/axiosClient";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../models/Expense";
import toast from "react-hot-toast";

export const expenseKeys = {
  all: ["expenses"] as const,
  detail: (id: string) => ["expenses", id] as const,
};

export const useExpensesQuery = () => {
  return useSuspenseQuery({
    queryKey: expenseKeys.all,
    queryFn: async (): Promise<Expense[]> => {
      const res = await axiosClient.get("/api/expenses");
      return res.data;
    },
  });
};

export const useExpenseQuery = (id: string) => {
  return useSuspenseQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: async (): Promise<Expense> => {
      const res = await axiosClient.get(`/api/expenses/${id}`);
      return res.data;
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: ExpenseCreate): Promise<Expense> => {
      const res = await axiosClient.post("/api/expenses", expense);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense created successfully");
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExpenseUpdate }): Promise<Expense> => {
      const res = await axiosClient.put(`/api/expenses/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
      toast.success("Expense updated successfully");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosClient.delete(`/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense deleted successfully");
    },
  });
};
