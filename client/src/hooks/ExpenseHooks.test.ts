import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useExpensesQuery,
  useCreateExpense,
  useDeleteExpense,
} from "./ExpenseHooks";
import { axiosClient } from "../utils/axiosClient";
import type { Expense, ExpenseCreate } from "../models/Expense";
import { createElement } from "react";

vi.mock("../utils/axiosClient");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("ExpenseHooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useExpensesQuery", () => {
    it("fetches expenses successfully", async () => {
      const mockExpenses: Expense[] = [
        {
          id: "1",
          amount: 50.0,
          category: "Food",
          merchant: "Restaurant",
          date: new Date("2025-12-01"),
          description: "Lunch",
          createdTime: new Date("2025-12-01"),
        },
      ];

      vi.mocked(axiosClient.get).mockResolvedValue({ data: mockExpenses });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockExpenses);
      expect(axiosClient.get).toHaveBeenCalledWith("/api/expenses");
    });
  });

  describe("useCreateExpense", () => {
    it("creates an expense and invalidates queries", async () => {
      const newExpense: ExpenseCreate = {
        amount: 100.0,
        category: "Shopping",
        merchant: "Store",
        date: "2025-12-02",
        description: "New purchase",
      };

      const createdExpense: Expense = {
        id: "2",
        amount: newExpense.amount,
        category: newExpense.category,
        merchant: newExpense.merchant,
        description: newExpense.description || "",
        date: new Date(newExpense.date),
        createdTime: new Date(),
      };

      vi.mocked(axiosClient.post).mockResolvedValue({ data: createdExpense });

      const { result } = renderHook(() => useCreateExpense(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newExpense);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/api/expenses",
        newExpense
      );
      expect(result.current.data).toEqual(createdExpense);
    });
  });

  describe("useDeleteExpense", () => {
    it("deletes an expense successfully", async () => {
      vi.mocked(axiosClient.delete).mockResolvedValue({ data: undefined });

      const { result } = renderHook(() => useDeleteExpense(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(axiosClient.delete).toHaveBeenCalledWith("/api/expenses/1");
    });
  });
});
