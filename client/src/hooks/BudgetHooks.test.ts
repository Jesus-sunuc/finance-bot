import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBudgets, useCreateBudget, useDeleteBudget } from "./BudgetHooks";
import { axiosClient } from "../utils/axiosClient";
import type { Budget, BudgetCreate } from "../models/Budget";
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

describe("BudgetHooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useBudgets", () => {
    it("fetches budgets successfully", async () => {
      const mockBudgets: Budget[] = [
        {
          id: "1",
          category: "Food",
          amount: 500.0,
          period: "monthly",
          spent: 150.0,
          remaining: 350.0,
          percentage: 30.0,
          startDate: "2025-12-01",
          createdTime: "2025-12-01T12:00:00Z",
        },
      ];

      vi.mocked(axiosClient.get).mockResolvedValue({ data: mockBudgets });

      const { result } = renderHook(() => useBudgets(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBudgets);
      expect(axiosClient.get).toHaveBeenCalledWith("/api/budgets");
    });
  });

  describe("useCreateBudget", () => {
    it("creates a budget successfully", async () => {
      const newBudget: BudgetCreate = {
        category: "Entertainment",
        amount: 200.0,
        period: "monthly",
        startDate: "2025-12-01",
      };

      const createdBudget: Budget = {
        id: "2",
        ...newBudget,
        spent: 0.0,
        remaining: 200.0,
        percentage: 0.0,
        startDate: newBudget.startDate!,
        createdTime: "2025-12-01T12:00:00Z",
      };

      vi.mocked(axiosClient.post).mockResolvedValue({ data: createdBudget });

      const { result } = renderHook(() => useCreateBudget(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newBudget);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(axiosClient.post).toHaveBeenCalledWith("/api/budgets", newBudget);
      expect(result.current.data).toEqual(createdBudget);
    });
  });

  describe("useDeleteBudget", () => {
    it("deletes a budget successfully", async () => {
      const deleteResponse = { success: true, message: "Budget deleted" };
      vi.mocked(axiosClient.delete).mockResolvedValue({ data: deleteResponse });

      const { result } = renderHook(() => useDeleteBudget(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(axiosClient.delete).toHaveBeenCalledWith("/api/budgets/1");
      expect(result.current.data).toEqual(deleteResponse);
    });
  });
});
